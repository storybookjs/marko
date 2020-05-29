import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import { sanitize, parseKind } from '@storybook/csf';
import { mapValues } from 'lodash';

import { StoryId, StoryKind, Args, Parameters, combineParameters } from '../index';
import merge from './merge';
import { Provider } from '../modules/provider';
import { ViewMode } from '../modules/addons';

export { StoryId };

export interface Root {
  id: StoryId;
  depth: 0;
  name: string;
  refId?: string;
  children: StoryId[];
  isComponent: false;
  isRoot: true;
  isLeaf: false;
  // MDX stories are "Group" type
  parameters?: {
    docsOnly?: boolean;
    [k: string]: any;
  };
}

export interface Group {
  id: StoryId;
  depth: number;
  name: string;
  children: StoryId[];
  refId?: string;
  parent?: StoryId;
  isComponent: boolean;
  isRoot: false;
  isLeaf: false;
  // MDX stories are "Group" type
  parameters?: {
    docsOnly?: boolean;
    viewMode?: ViewMode;
    [parameterName: string]: any;
  };
}

export interface Story {
  id: StoryId;
  depth: number;
  parent: StoryId;
  name: string;
  kind: StoryKind;
  refId?: string;
  children?: StoryId[];
  isComponent: boolean;
  isRoot: false;
  isLeaf: true;
  parameters?: {
    fileName: string;
    options: {
      hierarchyRootSeparator?: RegExp;
      hierarchySeparator?: RegExp;
      showRoots?: boolean;
      [optionName: string]: any;
    };
    docsOnly?: boolean;
    viewMode?: ViewMode;
    [parameterName: string]: any;
  };
  args: Args;
}

export interface StoryInput {
  id: StoryId;
  name: string;
  refId?: string;
  kind: StoryKind;
  children: string[];
  parameters: {
    fileName: string;
    options: {
      hierarchyRootSeparator: RegExp;
      hierarchySeparator: RegExp;
      showRoots?: boolean;
      [optionName: string]: any;
    };
    docsOnly?: boolean;
    viewMode?: ViewMode;
    [parameterName: string]: any;
  };
  isLeaf: boolean;
  args: Args;
}

export interface StoriesHash {
  [id: string]: Root | Group | Story;
}

export type StoriesList = (Group | Story)[];

export type GroupsList = (Root | Group)[];

export interface StoriesRaw {
  [id: string]: StoryInput;
}

export interface SetStoriesPayload {
  v?: number;
  stories: StoriesRaw;
}

export interface SetStoriesPayloadV2 extends SetStoriesPayload {
  v: 2;
  error?: Error;
  globalArgs: Args;
  globalParameters: Parameters;
  kindParameters: {
    [kind: string]: Parameters;
  };
}

const warnUsingHierarchySeparatorsAndShowRoots = deprecate(
  () => {},
  dedent`
    You cannot use both the hierarchySeparator/hierarchyRootSeparator and showRoots options.
  `
);

const warnRemovingHierarchySeparators = deprecate(
  () => {},
  dedent`
    hierarchySeparator and hierarchyRootSeparator are deprecated and will be removed in Storybook 6.0.
    Read more about it in the migration guide: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md
  `
);

const warnChangingDefaultHierarchySeparators = deprecate(
  () => {},
  dedent`
    The default hierarchy separators are changing in Storybook 6.0.
    '|' and '.' will no longer create a hierarchy, but codemods are available.
    Read more about it in the migration guide: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md
  `
);

const toKey = (input: string) =>
  input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

const toGroup = (name: string) => ({
  name,
  id: toKey(name),
});

export const denormalizeStoryParameters = ({
  globalParameters,
  kindParameters,
  stories,
}: SetStoriesPayloadV2): StoriesRaw => {
  return mapValues(stories, (storyData) => ({
    ...storyData,
    parameters: combineParameters(
      globalParameters,
      kindParameters[storyData.kind],
      (storyData.parameters as unknown) as Parameters
    ),
  }));
};

export const transformStoriesRawToStoriesHash = (
  input: StoriesRaw,
  base: StoriesHash,
  { provider }: { provider: Provider }
): StoriesHash => {
  const anyKindMatchesOldHierarchySeparators = Object.values(input)
    .filter(Boolean)
    .some(({ kind }) => kind.match(/\.|\|/));

  const storiesHashOutOfOrder = Object.values(input)
    .filter(Boolean)
    .reduce((acc, item) => {
      const { kind, parameters } = item;
      const {
        hierarchyRootSeparator: rootSeparator = undefined,
        hierarchySeparator: groupSeparator = undefined,
        showRoots = undefined,
      } = { ...provider.getConfig(), ...((parameters && parameters.options) || {}) };

      const usingShowRoots = typeof showRoots !== 'undefined';

      // Kind splitting behavior as per https://github.com/storybookjs/storybook/issues/8793
      let root = '';
      let groups: string[];
      // 1. If the user has passed separators, use the old behavior but warn them
      if (typeof rootSeparator !== 'undefined' || typeof groupSeparator !== 'undefined') {
        warnRemovingHierarchySeparators();
        if (usingShowRoots) warnUsingHierarchySeparatorsAndShowRoots();
        ({ root, groups } = parseKind(kind, {
          rootSeparator: rootSeparator || '|',
          groupSeparator: groupSeparator || /\/|\./,
        }));

        // 2. If the user hasn't passed separators, but is using | or . in kinds, use the old behaviour but warn
      } else if (anyKindMatchesOldHierarchySeparators && !usingShowRoots) {
        warnChangingDefaultHierarchySeparators();
        ({ root, groups } = parseKind(kind, { rootSeparator: '|', groupSeparator: /\/|\./ }));

        // 3. If the user passes showRoots, or doesn't match above, do a simpler splitting.
      } else {
        const parts: string[] = kind.split('/');
        if (showRoots && parts.length > 1) {
          [root, ...groups] = parts;
        } else {
          groups = parts;
        }
      }

      const rootAndGroups = []
        .concat(root || [])
        .concat(groups)
        .map(toGroup)
        // Map a bunch of extra fields onto the groups, collecting the path as we go (thus the reduce)
        .reduce((soFar, group, index, original) => {
          const { name } = group;
          const parent = index > 0 && soFar[index - 1].id;
          const id = sanitize(parent ? `${parent}-${name}` : name);
          if (parent === id) {
            throw new Error(
              dedent`
              Invalid part '${name}', leading to id === parentId ('${id}'), inside kind '${kind}'

              Did you create a path that uses the separator char accidentally, such as 'Vue <docs/>' where '/' is a separator char? See https://github.com/storybookjs/storybook/issues/6128
            `
            );
          }

          if (!!root && index === 0) {
            const result: Root = {
              ...group,
              id,
              depth: index,
              children: [],
              isComponent: false,
              isLeaf: false,
              isRoot: true,
              parameters,
            };
            return soFar.concat([result]);
          }
          const result: Group = {
            ...group,
            id,
            parent,
            depth: index,
            children: [],
            isComponent: false,
            isLeaf: false,
            isRoot: false,
            parameters,
          };
          return soFar.concat([result]);
        }, [] as GroupsList);

      const paths = [...rootAndGroups.map((g) => g.id), item.id];

      // Ok, now let's add everything to the store
      rootAndGroups.forEach((group, index) => {
        const child = paths[index + 1];
        const { id } = group;
        acc[id] = merge(acc[id] || {}, {
          ...group,
          ...(child && { children: [child] }),
        });
      });

      const story: Story = {
        ...item,
        depth: rootAndGroups.length,
        parent: rootAndGroups[rootAndGroups.length - 1].id,
        isLeaf: true,
        isComponent: false,
        isRoot: false,
      };
      acc[item.id] = story;

      return acc;
    }, {} as StoriesHash);

  function addItem(acc: StoriesHash, item: Story | Group) {
    if (!acc[item.id]) {
      // If we were already inserted as part of a group, that's great.
      acc[item.id] = item;
      const { children } = item;
      if (children) {
        const childNodes = children.map((id) => storiesHashOutOfOrder[id]) as (Story | Group)[];
        acc[item.id].isComponent = childNodes.every((childNode) => childNode.isLeaf);
        childNodes.forEach((childNode) => addItem(acc, childNode));
      }
    }
    return acc;
  }

  return Object.values(storiesHashOutOfOrder).reduce(addItem, { ...base });
};

export type Item = StoriesHash[keyof StoriesHash];

export function isRoot(item: Item): item is Root {
  if (item as Root) {
    return item.isRoot;
  }
  return false;
}
export function isGroup(item: Item): item is Group {
  if (item as Group) {
    return !item.isRoot && !item.isLeaf;
  }
  return false;
}
export function isStory(item: Item): item is Story {
  if (item as Story) {
    return item.isLeaf;
  }
  return false;
}
