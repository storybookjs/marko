import { DOCS_MODE } from 'global';
import { toId, sanitize } from '@storybook/csf';
import {
  UPDATE_STORY_ARGS,
  STORY_ARGS_UPDATED,
  STORY_CHANGED,
  SET_STORIES,
  SELECT_STORY,
} from '@storybook/core-events';

import {
  transformStoriesRawToStoriesHash,
  StoriesHash,
  Story,
  Group,
  StoriesRaw,
  StoryId,
  isStory,
  isRoot,
} from '../lib/stories';

import { Module, Args } from '../index';

type Direction = -1 | 1;
type ParameterName = string;

type ViewMode = 'story' | 'info' | 'settings' | string | undefined;

export interface SubState {
  storiesHash: StoriesHash;
  storyId: StoryId;
  viewMode: ViewMode;
  storiesConfigured: boolean;
}

export interface SubAPI {
  storyId: typeof toId;
  selectStory: (kindOrId: string, story?: string, obj?: any) => void;
  getCurrentStoryData: () => Story | Group;
  setStories: (stories: StoriesRaw) => void;
  jumpToComponent: (direction: Direction) => void;
  jumpToStory: (direction: Direction) => void;
  getData: (storyId: StoryId) => Story | Group;
  getParameters: (storyId: StoryId, parameterName?: ParameterName) => Story['parameters'] | any;
  getCurrentParameter<S>(parameterName?: ParameterName): S;
  updateStoryArgs(id: StoryId, newArgs: Args): void;
  findLeafStoryId(StoriesHash: StoriesHash, storyId: StoryId): StoryId;
}

// When adding a group, also add all of its children, depth first

const initStoriesApi = ({
  fullAPI,
  store,
  navigate,
  provider,
  storyId: initialStoryId,
  viewMode: initialViewMode,
}: Module) => {
  const api: SubAPI = {
    storyId: toId,
    getData: storyId => {
      const { storiesHash } = store.getState();
      const item = storiesHash[storyId];

      if (!isRoot(item)) {
        return item;
      }

      return undefined;
    },
    getCurrentStoryData: () => {
      const { storyId } = store.getState();

      return api.getData(storyId);
    },
    getParameters: (storyId, parameterName) => {
      const data = api.getData(storyId);

      if (isStory(data)) {
        const { parameters } = data;
        return parameterName ? parameters[parameterName] : parameters;
      }

      return null;
    },
    getCurrentParameter: function getCurrentParameter<S>(parameterName: ParameterName) {
      const { storyId } = store.getState();
      const parameters = api.getParameters(storyId, parameterName);

      if (parameters) {
        return parameters as S;
      }
      return undefined;
    },
    jumpToComponent: direction => {
      const state = store.getState();
      const { storiesHash, viewMode, storyId } = state;

      // cannot navigate when there's no current selection
      if (!storyId || !storiesHash[storyId]) {
        return;
      }

      const lookupList = Object.entries(storiesHash).reduce((acc, i) => {
        const value = i[1];
        if (value.isComponent) {
          acc.push([...i[1].children]);
        }
        return acc;
      }, []);

      const index = lookupList.findIndex(i => i.includes(storyId));

      // cannot navigate beyond fist or last
      if (index === lookupList.length - 1 && direction > 0) {
        return;
      }
      if (index === 0 && direction < 0) {
        return;
      }

      const result = lookupList[index + direction][0];

      navigate(`/${viewMode || 'story'}/${result}`);
    },
    jumpToStory: direction => {
      const { storiesHash, viewMode, storyId } = store.getState();

      if (DOCS_MODE) {
        api.jumpToComponent(direction);
        return;
      }

      // cannot navigate when there's no current selection
      if (!storyId || !storiesHash[storyId]) {
        return;
      }

      const lookupList = Object.keys(storiesHash).filter(
        k => !(storiesHash[k].children || Array.isArray(storiesHash[k]))
      );
      const index = lookupList.indexOf(storyId);

      // cannot navigate beyond fist or last
      if (index === lookupList.length - 1 && direction > 0) {
        return;
      }
      if (index === 0 && direction < 0) {
        return;
      }

      const result = lookupList[index + direction];

      if (viewMode && result) {
        navigate(`/${viewMode}/${result}`);
      }
    },
    // Recursively traverse storiesHash from the initial storyId until finding
    // the leaf story.
    findLeafStoryId: (storiesHash, storyId) => {
      if (storiesHash[storyId].isLeaf) {
        return storyId;
      }

      const childStoryId = storiesHash[storyId].children[0];
      return api.findLeafStoryId(storiesHash, childStoryId);
    },

    setStories: input => {
      // Now create storiesHash by reordering the above by group
      const storiesHash = transformStoriesRawToStoriesHash(
        input,
        (store.getState().storiesHash || {}) as StoriesHash,
        { provider }
      );
      const settingsPageList = ['about', 'shortcuts'];
      const { storyId, viewMode } = store.getState();

      if (storyId && storyId.match(/--\*$/)) {
        const idStart = storyId.slice(0, -1); // drop the * at the end
        const firstKindLeaf = Object.values(storiesHash).find(
          (s: Story | Group) => !s.children && s.id.substring(0, idStart.length) === idStart
        );

        if (viewMode && firstKindLeaf) {
          navigate(`/${viewMode}/${firstKindLeaf.id}`);
        }
      } else if (!storyId || storyId === '*' || !storiesHash[storyId]) {
        // when there's no storyId or the storyId item doesn't exist
        // we pick the first leaf and navigate
        const firstLeaf = Object.values(storiesHash).find((s: Story | Group) => !s.children);

        if (viewMode === 'settings' && settingsPageList.includes(storyId)) {
          navigate(`/${viewMode}/${storyId}`);
        } else if (viewMode === 'settings' && !settingsPageList.includes(storyId)) {
          navigate(`/story/${firstLeaf.id}`);
        } else if (viewMode && firstLeaf) {
          navigate(`/${viewMode}/${firstLeaf.id}`);
        }
      } else if (storiesHash[storyId] && !storiesHash[storyId].isLeaf) {
        // When story exists but if it is not the leaf story, it finds the proper
        // leaf story from any depth.
        const firstLeafStoryId = api.findLeafStoryId(storiesHash, storyId);
        navigate(`/${viewMode}/${firstLeafStoryId}`);
      }

      store.setState({
        storiesHash,
        storiesConfigured: true,
      });
    },

    selectStory: (kindOrId, story = undefined) => {
      const { viewMode = 'story', storyId, storiesHash } = store.getState();

      const hash = storiesHash;

      if (!story) {
        const real = sanitize(kindOrId);
        const s = hash[real];
        // eslint-disable-next-line no-nested-ternary
        const id = s ? (s.children ? s.children[0] : s.id) : kindOrId;
        navigate(`/${viewMode}/${id}`);
      } else if (!kindOrId) {
        // This is a slugified version of the kind, but that's OK, our toId function is idempotent
        const kind = storyId.split('--', 2)[0];
        const id = toId(kind, story);

        api.selectStory(id);
      } else {
        const id = toId(kindOrId, story);
        if (hash[id]) {
          api.selectStory(id);
        } else {
          // Support legacy API with component permalinks, where kind is `x/y` but permalink is 'z'
          const k = hash[sanitize(kindOrId)];
          if (k && k.children) {
            const foundId = k.children.find(childId => hash[childId].name === story);
            if (foundId) {
              api.selectStory(foundId);
            }
          }
        }
      }
    },
    updateStoryArgs: (id, newArgs) => {
      fullAPI.emit(UPDATE_STORY_ARGS, id, newArgs);
    },
  };

  const init = () => {
    fullAPI.on(STORY_CHANGED, (id: string) => {
      const options = fullAPI.getParameters(id, 'options');

      if (options) {
        fullAPI.setOptions(options);
      }
    });

    fullAPI.on(SET_STORIES, (data: { stories: StoriesRaw }) => {
      const { storyId } = store.getState();
      fullAPI.setStories(data.stories);
      const options = storyId
        ? fullAPI.getParameters(storyId, 'options')
        : fullAPI.getParameters(Object.keys(data.stories)[0], 'options');
      fullAPI.setOptions(options);
    });

    fullAPI.on(
      SELECT_STORY,
      ({ kind, story, ...rest }: { kind: string; story: string; [k: string]: any }) => {
        fullAPI.selectStory(kind, story, rest);
      }
    );

    fullAPI.on(STORY_ARGS_UPDATED, (id: StoryId, args: Args) => {
      const { storiesHash } = store.getState();
      (storiesHash[id] as Story).args = args;
      store.setState({ storiesHash });
    });
  };

  return {
    api,
    state: {
      storiesHash: {},
      storyId: initialStoryId,
      viewMode: initialViewMode,
      storiesConfigured: false,
    },
    init,
  };
};
export default initStoriesApi;
