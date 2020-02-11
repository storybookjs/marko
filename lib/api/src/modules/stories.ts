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
} from '../lib/stories';

import { Module } from '../index';

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
}

// When adding a group, also add all of its children, depth first

const initStoriesApi = ({
  store,
  navigate,
  storyId: initialStoryId,
  viewMode: initialViewMode,
}: Module) => {
  const getData = (storyId: StoryId) => {
    const { storiesHash } = store.getState();

    if (storiesHash[storyId]) {
      return storiesHash[storyId];
    }

    return undefined;
  };
  const getCurrentStoryData = () => {
    const { storyId } = store.getState();

    return getData(storyId);
  };
  const getParameters = (storyId: StoryId, parameterName?: ParameterName) => {
    const data = getData(storyId);

    if (isStory(data)) {
      const { parameters } = data;
      return parameterName ? parameters[parameterName] : parameters;
    }

    return null;
  };

  const getCurrentParameter = function getCurrentParameter<S>(parameterName: ParameterName) {
    const { storyId } = store.getState();
    const parameters = getParameters(storyId, parameterName);

    if (parameters) {
      return parameters as S;
    }
    return undefined;
  };

  const jumpToComponent = (direction: Direction) => {
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
  };

  const jumpToStory = (direction: Direction) => {
    const { storiesHash, viewMode, storyId } = store.getState();

    if (DOCS_MODE) {
      jumpToComponent(direction);
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

  const setStories = (input: StoriesRaw) => {
    // Now create storiesHash by reordering the above by group
    const storiesHash: StoriesHash = transformStoriesRawToStoriesHash(
      input,
      (store.getState().storiesHash || {}) as StoriesHash
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
      const firstLeafStoryId = findLeafStoryId(storiesHash, storyId);
      navigate(`/${viewMode}/${firstLeafStoryId}`);
    }

    store.setState({
      storiesHash,
      storiesConfigured: true,
    });
  };

  const selectStory = (kindOrId: string, story: string = undefined) => {
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

      selectStory(id);
    } else {
      const id = toId(kindOrId, story);
      if (hash[id]) {
        selectStory(id);
      } else {
        // Support legacy API with component permalinks, where kind is `x/y` but permalink is 'z'
        const k = hash[sanitize(kindOrId)];
        if (k && k.children) {
          const foundId = k.children.find(childId => hash[childId].name === story);
          if (foundId) {
            selectStory(foundId);
          }
        }
      }
    }
  };

  return {
    api: {
      storyId: toId,
      selectStory,
      getCurrentStoryData,
      setStories,
      jumpToComponent,
      jumpToStory,
      getData,
      getParameters,
      getCurrentParameter,
    },
    state: {
      storiesHash: {},
      storyId: initialStoryId,
      viewMode: initialViewMode,
      storiesConfigured: false,
    },
  };
};
export default initStoriesApi;
