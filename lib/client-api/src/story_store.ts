/* eslint no-underscore-dangle: 0 */
import EventEmitter from 'eventemitter3';
import memoize from 'memoizerific';
import debounce from 'lodash/debounce';
import dedent from 'ts-dedent';
import stable from 'stable';

import { Channel } from '@storybook/channels';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import {
  Comparator,
  Parameters,
  Args,
  LegacyStoryFn,
  ArgsStoryFn,
  StoryFn,
  StoryContext,
} from '@storybook/addons';
import {
  DecoratorFunction,
  StoryMetadata,
  StoreData,
  AddStoryArgs,
  StoreItem,
  PublishedStoreItem,
  ErrorLike,
  GetStorybookKind,
  ParameterEnhancer,
} from './types';
import { HooksContext } from './hooks';
import storySort from './storySort';
import { combineParameters } from './parameters';

interface Selection {
  storyId: string;
  viewMode: string;
}

interface StoryOptions {
  includeDocsOnly?: boolean;
}

type KindMetadata = StoryMetadata & { order: number };

const isStoryDocsOnly = (parameters?: Parameters) => {
  return parameters && parameters.docsOnly;
};

const includeStory = (story: StoreItem, options: StoryOptions = { includeDocsOnly: false }) => {
  if (options.includeDocsOnly) {
    return true;
  }
  return !isStoryDocsOnly(story.parameters);
};

const toExtracted = <T>(obj: T) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      return acc;
    }
    if (key === 'hooks') {
      return acc;
    }
    if (Array.isArray(value)) {
      return Object.assign(acc, { [key]: value.slice().sort() });
    }
    return Object.assign(acc, { [key]: value });
  }, {});

export default class StoryStore extends EventEmitter {
  _error?: ErrorLike;

  _channel: Channel;

  _globalArgs: Args;

  _globalMetadata: StoryMetadata;

  // Keyed on kind name
  _kinds: Record<string, KindMetadata>;

  // Keyed on storyId
  _stories: StoreData;

  _parameterEnhancers: ParameterEnhancer[];

  _revision: number;

  _selection: Selection;

  constructor(params: { channel: Channel }) {
    super();

    this._globalArgs = {};
    this._globalMetadata = { parameters: {}, decorators: [] };
    this._kinds = {};
    this._stories = {};
    this._parameterEnhancers = [];
    this._revision = 0;
    this._selection = {} as any;
    this._error = undefined;

    if (params.channel) this.setChannel(params.channel);
  }

  setChannel = (channel: Channel) => {
    this._channel = channel;
    channel.on(Events.CHANGE_STORY_ARGS, (id: string, newArgs: Args) =>
      this.setStoryArgs(id, newArgs)
    );
    channel.on(Events.CHANGE_GLOBAL_ARGS, (newGlobals: Args) => this.setGlobalArgs(newGlobals));
  };

  addGlobalMetadata({ parameters, decorators }: StoryMetadata) {
    const globalParameters = this._globalMetadata.parameters;

    this._globalMetadata.parameters = combineParameters(globalParameters, parameters);

    this._globalMetadata.decorators.push(...decorators);
  }

  clearGlobalDecorators() {
    this._globalMetadata.decorators = [];
  }

  ensureKind(kind: string) {
    if (!this._kinds[kind]) {
      this._kinds[kind] = {
        order: Object.keys(this._kinds).length,
        parameters: {},
        decorators: [],
      };
    }
  }

  addKindMetadata(kind: string, { parameters, decorators }: StoryMetadata) {
    this.ensureKind(kind);
    this._kinds[kind].parameters = combineParameters(this._kinds[kind].parameters, parameters);

    this._kinds[kind].decorators.push(...decorators);
  }

  addParameterEnhancer(parameterEnhancer: ParameterEnhancer) {
    if (Object.keys(this._stories).length > 0)
      throw new Error('Cannot add a parameter enhancer to the store after a story has been added.');

    this._parameterEnhancers.push(parameterEnhancer);
  }

  addStory(
    {
      id,
      kind,
      name,
      storyFn: original,
      parameters: storyParameters = {},
      decorators: storyDecorators = [],
    }: AddStoryArgs,
    {
      applyDecorators,
    }: {
      applyDecorators: (fn: StoryFn, decorators: DecoratorFunction[]) => any;
    }
  ) {
    const { _stories } = this;

    if (_stories[id]) {
      logger.warn(dedent`
        Story with id ${id} already exists in the store!

        Perhaps you added the same story twice, or you have a name collision?
        Story ids need to be unique -- ensure you aren't using the same names modulo url-sanitization.
      `);
    }

    const identification = {
      id,
      kind,
      name,
      story: name, // legacy
    };

    // immutable original storyFn
    const getOriginal = () => original;

    this.ensureKind(kind);
    const kindMetadata: KindMetadata = this._kinds[kind];
    const decorators = [
      ...storyDecorators,
      ...kindMetadata.decorators,
      ...this._globalMetadata.decorators,
    ];
    const parametersBeforeEnhancement = combineParameters(
      this._globalMetadata.parameters,
      kindMetadata.parameters,
      storyParameters
    );

    const parameters = this._parameterEnhancers.reduce(
      (accumlatedParameters, enhancer) =>
        combineParameters(
          accumlatedParameters,
          enhancer({ ...identification, parameters: accumlatedParameters, args: {} })
        ),
      parametersBeforeEnhancement
    );

    let finalStoryFn: LegacyStoryFn;
    if (parameters.passArgsFirst) {
      finalStoryFn = (context: StoryContext) => (original as ArgsStoryFn)(context.args, context);
    } else {
      finalStoryFn = original as LegacyStoryFn;
    }

    // lazily decorate the story when it's loaded
    const getDecorated: () => StoryFn = memoize(1)(() => applyDecorators(finalStoryFn, decorators));

    const hooks = new HooksContext();

    const storyFn: StoryFn = (runtimeContext: StoryContext) =>
      getDecorated()({
        ...identification,
        ...runtimeContext,
        parameters,
        hooks,
        args: _stories[id].args,
        globalArgs: this._globalArgs,
      });

    // Pull out parameters.argTypes.$.defaultValue into initialArgs
    const initialArgs: Args = parameters.args || {};
    const defaultArgs: Args = parameters.argTypes
      ? Object.entries(parameters.argTypes as Record<string, { defaultValue: any }>).reduce(
          (acc, [arg, { defaultValue }]) => {
            if (defaultValue) acc[arg] = defaultValue;
            return acc;
          },
          {} as Args
        )
      : {};

    _stories[id] = {
      ...identification,

      hooks,
      getDecorated,
      getOriginal,
      storyFn,

      parameters,
      args: { ...defaultArgs, ...initialArgs },
    };

    // LET'S SEND IT TO THE MANAGER
    this.pushToManager();
  }

  remove = (id: string): void => {
    const { _stories } = this;
    const story = _stories[id];
    delete _stories[id];

    if (story) story.hooks.clean();
  };

  removeStoryKind(kind: string) {
    if (!this._kinds[kind]) return;

    this._kinds[kind].parameters = {};
    this._kinds[kind].decorators = [];

    this.cleanHooksForKind(kind);
    this._stories = Object.entries(this._stories).reduce((acc: StoreData, [id, story]) => {
      if (story.kind !== kind) acc[id] = story;

      return acc;
    }, {});
    this.pushToManager();
  }

  setGlobalArgs(newGlobalArgs: Args) {
    this._globalArgs = { ...this._globalArgs, ...newGlobalArgs };
    this._channel.emit(Events.GLOBAL_ARGS_CHANGED, this._globalArgs);
  }

  setStoryArgs(id: string, newArgs: Args) {
    if (!this._stories[id]) throw new Error(`No story for id ${id}`);
    const { args } = this._stories[id];
    this._stories[id].args = { ...args, ...newArgs };

    // TODO: Sort out what is going on with both the store and the channel being event emitters.
    // It has something to do with React Native, but need to get to the bottom of it
    this._channel.emit(Events.STORY_ARGS_CHANGED, id, this._stories[id].args);
    this.emit(Events.STORY_ARGS_CHANGED, id, this._stories[id].args);
  }

  fromId = (id: string): PublishedStoreItem | null => {
    try {
      const data = this._stories[id as string];

      if (!data || !data.getDecorated) {
        return null;
      }

      return {
        ...data,
        globalArgs: this._globalArgs,
      };
    } catch (e) {
      logger.warn('failed to get story:', this._stories);
      logger.error(e);
      return null;
    }
  };

  raw(options?: StoryOptions) {
    return Object.values(this._stories)
      .filter(i => !!i.getDecorated)
      .filter(i => includeStory(i, options))
      .map(({ id }) => this.fromId(id));
  }

  extract(options?: StoryOptions) {
    const stories = Object.entries(this._stories);
    // determine if we should apply a sort to the stories or use default import order
    if (Object.values(this._stories).length > 0) {
      const index = Object.keys(this._stories).find(
        key =>
          !!(
            this._stories[key] &&
            this._stories[key].parameters &&
            this._stories[key].parameters.options
          )
      );
      if (index && this._stories[index].parameters.options.storySort) {
        const storySortParameter = this._stories[index].parameters.options.storySort;
        let sortFn: Comparator<any>;
        if (typeof storySortParameter === 'function') {
          sortFn = storySortParameter;
        } else {
          sortFn = storySort(storySortParameter);
        }
        stable.inplace(stories, sortFn);
      } else {
        // NOTE: when kinds are HMR'ed they get temporarily removed from the `_stories` array
        // and thus lose order. However `_kindOrder` preservers the original load order
        stable.inplace(
          stories,
          (s1, s2) => this._kinds[s1[1].kind].order - this._kinds[s2[1].kind].order
        );
      }
    }
    // removes function values from all stories so they are safe to transport over the channel
    return stories.reduce(
      (a, [k, v]) => (includeStory(v, options) ? Object.assign(a, { [k]: toExtracted(v) }) : a),
      {}
    );
  }

  setSelection(data: Selection | undefined, error: ErrorLike): void {
    this._selection =
      data === undefined ? this._selection : { storyId: data.storyId, viewMode: data.viewMode };
    this._error = error === undefined ? this._error : error;

    // Try and emit the STORY_RENDER event synchronously, but if the channel is not ready (RN),
    // we'll try again later.
    let isStarted = false;
    if (this._channel) {
      this._channel.emit(Events.STORY_RENDER);
      isStarted = true;
    }

    setTimeout(() => {
      if (this._channel && !isStarted) {
        this._channel.emit(Events.STORY_RENDER);
      }

      // should be deprecated in future.
      this.emit(Events.STORY_RENDER);
    }, 1);
  }

  getSelection = (): Selection => this._selection;

  getError = (): ErrorLike | undefined => this._error;

  getStoriesForManager = () => {
    return this.extract({ includeDocsOnly: true });
  };

  pushToManager = debounce(() => {
    if (this._channel) {
      const stories = this.getStoriesForManager();

      // send to the parent frame.
      this._channel.emit(Events.SET_STORIES, { stories });
    }
  }, 0);

  getStoryKinds() {
    return Array.from(new Set(this.raw().map(s => s.kind)));
  }

  getStoriesForKind(kind: string) {
    return this.raw().filter(story => story.kind === kind);
  }

  getRawStory(kind: string, name: string) {
    return this.getStoriesForKind(kind).find(s => s.name === name);
  }

  getRevision() {
    return this._revision;
  }

  incrementRevision() {
    this._revision += 1;
  }

  cleanHooks(id: string) {
    if (this._stories[id]) {
      this._stories[id].hooks.clean();
    }
  }

  cleanHooksForKind(kind: string) {
    this.getStoriesForKind(kind).map(story => this.cleanHooks(story.id));
  }

  // This API is a reimplementation of Storybook's original getStorybook() API.
  // As such it may not behave *exactly* the same, but aims to. Some notes:
  //  - It is *NOT* sorted by the user's sort function, but remains sorted in "insertion order"
  //  - It does not include docs-only stories
  getStorybook(): GetStorybookKind[] {
    return Object.values(
      this.raw().reduce((kinds: { [kind: string]: GetStorybookKind }, story) => {
        if (!includeStory(story)) return kinds;

        const {
          kind,
          name,
          storyFn,
          parameters: { fileName },
        } = story;

        // eslint-disable-next-line no-param-reassign
        if (!kinds[kind]) kinds[kind] = { kind, fileName, stories: [] };

        kinds[kind].stories.push({ name, render: storyFn });

        return kinds;
      }, {})
    ).sort((s1, s2) => this._kinds[s1.kind].order - this._kinds[s2.kind].order);
  }
}
