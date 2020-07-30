import { history, document } from 'global';
import qs from 'qs';
import deprecate from 'util-deprecate';
import { StoreSelectionSpecifier, StoreSelection } from '@storybook/client-api';
import { StoryId, ViewMode } from '@storybook/addons';

export function pathToId(path: string) {
  const match = (path || '').match(/^\/story\/(.+)/);
  if (!match) {
    throw new Error(`Invalid path '${path}',  must start with '/story/'`);
  }
  return match[1];
}

// todo add proper types
export const setPath = (selection?: StoreSelection) => {
  if (!selection) {
    return;
  }

  const { storyId, viewMode }: { storyId: StoryId; viewMode: ViewMode } = selection;
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

const deprecatedLegacyQuery = deprecate(
  () => 0,
  `URL formats with \`selectedKind\` and \`selectedName\` query parameters are deprecated. 
Use \`id=$storyId\` instead. 
See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-url-structure`
);
export const getSelectionSpecifierFromPath: () => StoreSelectionSpecifier = () => {
  const query = qs.parse(document.location.search, { ignoreQueryPrefix: true });

  let viewMode = getFirstString(query.viewMode) as ViewMode;
  if (typeof viewMode !== 'string' || !viewMode.match(/docs|story/)) {
    viewMode = 'story';
  }

  const path = getFirstString(query.path);
  const storyId = path ? pathToId(path) : getFirstString(query.id);

  if (storyId) {
    return { storySpecifier: storyId, viewMode };
  }

  // Legacy URL format
  const kind = getFirstString(query.selectedKind);
  const name = getFirstString(query.selectedStory);

  if (kind && name) {
    deprecatedLegacyQuery();
    return { storySpecifier: { kind, name }, viewMode };
  }
  return null;
};
