/* eslint no-underscore-dangle: 0 */
import EventEmitter from 'eventemitter3';
import memoize from 'memoizerific';
import debounce from 'lodash/debounce';
import dedent from 'ts-dedent';
import stable from 'stable';

import { Channel } from '@storybook/channels';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import { Comparator, Parameters, StoryFn } from '@storybook/addons';
import {
  DecoratorFunction,
  StoreData,
  AddStoryArgs,
  StoreItem,
  ErrorLike,
  GetStorybookKind,
} from './types';
import { HooksContext } from './hooks';
import storySort from './storySort';

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

interface Selection {
  storyId: string;
  viewMode: string;
}

interface StoryOptions {
  includeDocsOnly?: boolean;
}

type KindOrder = Record<string, number>;

const isStoryDocsOnly = (parameters?: Parameters) => {
  return parameters && parameters.docsOnly;
};

const includeStory = (story: StoreItem, options: StoryOptions = { includeDocsOnly: false }) => {
  if (options.includeDocsOnly) {
    return true;
  }
  return !isStoryDocsOnly(story.parameters);
};

export default class StoryStore extends EventEmitter {
  _error?: ErrorLike;

  _channel: Channel;

  _data: StoreData;

  _revision: number;

  _selection: Selection;

  _kindOrder: KindOrder;

  constructor(params: { channel: Channel }) {
    super();

    this._data = {} as any;
    this._revision = 0;
    this._selection = {} as any;
    this._channel = params.channel;
    this._error = undefined;
    this._kindOrder = {};
  }

  setChannel = (channel: Channel) => {
    this._channel = channel;
  };

  // NEW apis
  fromId = (id: string): StoreItem | null => {
    try {
      const data = this._data[id as string];

      if (!data || !data.getDecorated) {
        return null;
      }

      return data;
    } catch (e) {
      logger.warn('failed to get story:', this._data);
      logger.error(e);
      return null;
    }
  };

  raw(options?: StoryOptions) {
    return Object.values(this._data)
      .filter(i => !!i.getDecorated)
      .filter(i => includeStory(i, options))
      .map(({ id }) => this.fromId(id));
  }

  extract(options?: StoryOptions) {
    const stories = Object.entries(this._data);
    // determine if we should apply a sort to the stories or use default import order
    if (Object.values(this._data).length > 0) {
      const index = Object.keys(this._data).find(
        key =>
          !!(this._data[key] && this._data[key].parameters && this._data[key].parameters.options)
      );
      if (index && this._data[index].parameters.options.storySort) {
        const storySortParameter = this._data[index].parameters.options.storySort;
        let sortFn: Comparator<any>;
        if (typeof storySortParameter === 'function') {
          sortFn = storySortParameter;
        } else {
          sortFn = storySort(storySortParameter);
        }
        stable.inplace(stories, sortFn);
      } else {
        // NOTE: when kinds are HMR'ed they get temporarily removed from the `_data` array
        // and thus lose order. However `_kindOrder` preservers the original load order
        stable.inplace(
          stories,
          (s1, s2) => this._kindOrder[s1[1].kind] - this._kindOrder[s2[1].kind]
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

  remove = (id: string): void => {
    const { _data } = this;
    const story = _data[id];
    delete _data[id];

    if (story) story.hooks.clean();
  };

  addStory(
    { id, kind, name, storyFn: original, parameters = {} }: AddStoryArgs,
    {
      getDecorators,
      applyDecorators,
    }: {
      getDecorators: () => DecoratorFunction[];
      applyDecorators: (fn: StoryFn, decorators: DecoratorFunction[]) => any;
    }
  ) {
    const { _data } = this;

    if (_data[id]) {
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

    // lazily decorate the story when it's loaded
    const getDecorated: () => StoryFn = memoize(1)(() =>
      applyDecorators(getOriginal(), getDecorators())
    );

    const hooks = new HooksContext();

    const storyFn: StoryFn = p =>
      getDecorated()({
        ...identification,
        ...p,
        hooks,
        parameters: { ...parameters, ...(p && p.parameters) },
      });

    _data[id] = {
      ...identification,

      hooks,
      getDecorated,
      getOriginal,
      storyFn,

      parameters,
    };

    // Store 1-based order of kind loading to preserve sorting on HMR
    if (!this._kindOrder[kind]) {
      this._kindOrder[kind] = 1 + Object.keys(this._kindOrder).length;
    }

    // LET'S SEND IT TO THE MANAGER
    this.pushToManager();
  }

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
    if (this._data[id]) {
      this._data[id].hooks.clean();
    }
  }

  cleanHooksForKind(kind: string) {
    this.getStoriesForKind(kind).map(story => this.cleanHooks(story.id));
  }

  removeStoryKind(kind: string) {
    this.cleanHooksForKind(kind);
    this._data = Object.entries(this._data).reduce((acc: StoreData, [id, story]) => {
      if (story.kind !== kind) acc[id] = story;

      return acc;
    }, {});
    this.pushToManager();
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
    ).sort((s1, s2) => this._kindOrder[s1.kind] - this._kindOrder[s2.kind]);
  }
}
