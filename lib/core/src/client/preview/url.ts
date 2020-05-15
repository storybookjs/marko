import { history, document } from 'global';
import qs from 'qs';
import { toId } from '@storybook/csf';
import { StoryStore } from '@storybook/client-api';
import { StoryId, ViewMode } from '@storybook/addons';

export function pathToId(path: string) {
  const match = (path || '').match(/^\/story\/(.+)/);
  if (!match) {
    throw new Error(`Invalid path '${path}',  must start with '/story/'`);
  }
  return match[1];
}

// todo add proper types
export const setPath = ({ storyId, viewMode }: { storyId: StoryId; viewMode: ViewMode }) => {
  const { path, selectedKind, selectedStory, ...rest } = qs.parse(document.location.search, {
    ignoreQueryPrefix: true,
  });
  const newPath = `${document.location.pathname}?${qs.stringify({
    ...rest,
    id: storyId,
    viewMode,
  })}`;
  history.replaceState({}, '', newPath);
};

// todo add proper types
export const getIdFromLegacyQuery = (query: qs.ParsedQs, storyStore: StoryStore) => {
  const path = getFirstString(query.path);
  const selectedKind = getFirstString(query.selectedKind);
  const selectedStory = getFirstString(query.selectedStory);

  if (path) {
    return pathToId(path);
  }
  if (selectedKind && selectedStory) {
    // Look up the story ID inside the story store, since as of 5.3, the
    // Story ID is not necessarily a direct function of its kind/name.
    const story = storyStore.getRawStory(selectedKind, selectedStory);
    if (story) {
      return story.id;
    }
    // this will preserve existing behavior of showing a "not found" screen,
    // but the inputs will be preserved in the query param to help debugging
    return toId(selectedKind, selectedStory);
  }
  return undefined;
};

export const parseQueryParameters = (search: string) => {
  const { id } = qs.parse(search, { ignoreQueryPrefix: true });
  return id;
};

type ValueOf<T> = T[keyof T];
const isObject = (val: Record<string, any>) =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

const getFirstString = (v: ValueOf<qs.ParsedQs>): string | void => {
  if (typeof v === 'string') {
    return v;
  }
  if (Array.isArray(v)) {
    return getFirstString(v[0]);
  }
  if (isObject(v)) {
    // @ts-ignore
    return getFirstString(Object.values(v));
  }
  return undefined;
};

export const initializePath = (storyStore: StoryStore) => {
  const query = qs.parse(document.location.search, { ignoreQueryPrefix: true });
  let storyId = getFirstString(query.id);
  let viewMode = getFirstString(query.viewMode) as ViewMode;

  if (typeof viewMode !== 'string' || !viewMode.match(/docs|story/)) {
    viewMode = 'story';
  }

  if (!storyId) {
    storyId = getIdFromLegacyQuery(query, storyStore);
    if (storyId) {
      setPath({ storyId, viewMode });
    }
  }
  return { storyId, viewMode };
};
