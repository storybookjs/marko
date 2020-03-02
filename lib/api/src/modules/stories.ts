import { DOCS_MODE } from 'global';
import { toId, sanitize } from '@storybook/csf';

import {
  transformStoriesRawToStoriesHash,
  StoriesHash,
  Story,
  Group,
  StoriesRaw,
  StoryId,
  isStory,
  Root,
  isRoot,
} from '../lib/stories';

import { Module } from '../index';
import { InceptionRef, Refs } from './refs';

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
  resolveStory: (storyId: StoryId, storiesHash: StoriesHash, refs: Refs) => Story | Group | Root;
  splitStoryId: (storyId: StoryId) => { ref?: string; id: StoryId };
  selectStory: (kindOrId: string, story?: string, obj?: any) => void;
  getCurrentStoryData: () => Story | Group;
  setStories: (stories: StoriesRaw) => void;
  jumpToComponent: (direction: Direction) => void;
  jumpToStory: (direction: Direction) => void;
  getData: (storyId: StoryId) => Story | Group;
  getParameters: (storyId: StoryId, parameterName?: ParameterName) => Story['parameters'] | any;
  getCurrentParameter<S>(parameterName?: ParameterName): S;
}

// When adding a group, also add all of its children, depth first
const split = /((\w*)_)?(.*)/;

const initStoriesApi = ({
  store,
  navigate,
  provider,
  storyId: initialStoryId,
  viewMode: initialViewMode,
}: Module) => {
  const api: SubAPI = {
    storyId: toId,
    getData: storyId => {
      const { storiesHash, refs } = store.getState();

      const result = api.resolveStory(storyId, storiesHash, refs);

      return isRoot(result) ? undefined : result;
    },
    resolveStory: (storyId, storiesHash, refs) => {
      if (storyId) {
        if (storiesHash[storyId]) {
          return storiesHash[storyId];
        }

        const [, , refId] = storyId.match(split);

        if (refs && refs[refId] && refs[refId].stories && refs[refId].stories[storyId]) {
          return refs[refId].stories[storyId];
        }
      }

      return undefined;
    },
    splitStoryId: (storyId: StoryId) => {
      if (storyId) {
        const [, , refId, realid] = storyId.match(split);

        if (refId) {
          return { ref: refId, id: realid };
        }
        return { id: storyId };
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
    getCurrentParameter: parameterName => {
      const { storyId } = store.getState();
      const parameters = api.getParameters(storyId, parameterName);

      if (parameters) {
        return parameters;
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
      const { storiesHash, viewMode, storyId, refs } = store.getState();
      const story = api.getData(storyId);

      if (DOCS_MODE) {
        api.jumpToComponent(direction);
        return;
      }

      // cannot navigate when there's no current selection
      if (!story) {
        return;
      }

      const hash = story.refId ? refs[story.refId].stories : storiesHash;

      const lookupList = Object.keys(hash).filter(
        k => !(hash[k].children || Array.isArray(hash[k]))
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
    setStories: (input: StoriesRaw) => {
      // Now create storiesHash by reordering the above by group
      const storiesHash: StoriesHash = transformStoriesRawToStoriesHash(
        input,
        (store.getState().storiesHash || {}) as StoriesHash,
        { provider }
      );
      const settingsPageList = ['about', 'shortcuts'];
      const { storyId, viewMode, refs } = store.getState();
      const story = api.resolveStory(storyId, storiesHash, refs);

      if (storyId && storyId.match(/--\*$/)) {
        const idStart = storyId.slice(0, -1); // drop the * at the end
        const firstKindLeaf = Object.values(storiesHash).find(
          (s: Story | Group) => !s.children && s.id.substring(0, idStart.length) === idStart
        );

        if (viewMode && firstKindLeaf) {
          navigate(`/${viewMode}/${firstKindLeaf.id}`);
        }
      } else if (!storyId || storyId === '*' || !story) {
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
      } else if (story && !story.isLeaf) {
        // When story exists but if it is not the leaf story, it finds the proper
        // leaf story from any depth.
        const hash = story.refId ? refs[story.refId].stories : storiesHash;

        const firstLeafStoryId = findLeafStoryId(hash, storyId);
        navigate(`/${viewMode}/${firstLeafStoryId}`);
      }

      store.setState({
        storiesHash,
        storiesConfigured: true,
      });
    },
    selectStory: (
      kindOrId: string,
      story: string = undefined,
      options: { ref?: InceptionRef['id'] } = {}
    ) => {
      const { ref } = options;
      const { viewMode = 'story', storyId, storiesHash, refs } = store.getState();

      const hash = ref ? refs[ref].stories : storiesHash;

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

        api.selectStory(id, undefined, options);
      } else {
        const id = ref ? `${ref}_${toId(kindOrId, story)}` : toId(kindOrId, story);
        if (hash[id]) {
          api.selectStory(id, undefined, options);
        } else {
          // Support legacy API with component permalinks, where kind is `x/y` but permalink is 'z'
          const k = hash[sanitize(kindOrId)];
          if (k && k.children) {
            const foundId = k.children.find(childId => hash[childId].name === story);
            if (foundId) {
              api.selectStory(foundId, undefined, options);
            }
          }
        }
      }
    },
  };

  // Recursively traverse storiesHash from the initial storyId until finding
  // the leaf story.
  const findLeafStoryId = (storiesHash: StoriesHash, storyId: string): string => {
    if (storiesHash[storyId].isLeaf) {
      return storyId;
    }

    const childStoryId = storiesHash[storyId].children[0];
    return findLeafStoryId(storiesHash, childStoryId);
  };

  return {
    api,
    state: {
      storiesHash: {},
      storyId: initialStoryId,
      viewMode: initialViewMode,
      storiesConfigured: false,
    },
  };
};
export default initStoriesApi;
