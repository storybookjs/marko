import memoize from 'memoizerific';
import Fuse from 'fuse.js';
import { DOCS_MODE } from 'global';
import { SyntheticEvent } from 'react';
import { StoriesHash, isRoot, isStory } from '@storybook/api';

const FUZZY_SEARCH_THRESHOLD = 0.35;

export const prevent = (e: SyntheticEvent) => {
  e.preventDefault();
  return false;
};

const toList = memoize(1)((dataset: Dataset) => Object.values(dataset));

export type Item = StoriesHash[keyof StoriesHash];
export type Dataset = Record<string, Item>;
export type SelectedSet = Record<string, boolean>;
export type ExpandedSet = Record<string, boolean>;

export const keyEventToAction = ({
  keyCode,
  ctrlKey,
  shiftKey,
  altKey,
  metaKey,
}: KeyboardEvent) => {
  if (shiftKey || metaKey || ctrlKey || altKey) {
    return false;
  }
  switch (keyCode) {
    case 18: {
      return 'ENTER';
    }
    case 32: {
      return 'SPACE';
    }
    case 38: {
      return 'UP';
    }
    case 40: {
      return 'DOWN';
    }
    case 37: {
      return DOCS_MODE ? 'UP' : 'LEFT';
    }
    case 39: {
      return DOCS_MODE ? 'DOWN' : 'RIGHT';
    }
    default: {
      return false;
    }
  }
};

export const createId = (id: string, prefix: string) => `${prefix}_${id}`;

export const get = memoize(1000)((id: string, dataset: Dataset) => dataset[id]);
export const getParent = memoize(1000)((id: string, dataset: Dataset) => {
  const item = get(id, dataset);
  if (item && !isRoot(item)) {
    return get(item.parent, dataset);
  }
  return undefined;
});
export const getParents = memoize(1000)((id: string, dataset: Dataset): Item[] => {
  const parent = getParent(id, dataset);

  if (!parent) {
    return [];
  }
  return [parent, ...getParents(parent.id, dataset)];
});

export const getMains = memoize(1)((dataset: Dataset) =>
  toList(dataset).filter((m) => m.depth === 0)
);
const getMainsKeys = memoize(1)((dataset: Dataset) => getMains(dataset).map((m) => m.id));

export const getPrevious = ({
  id,
  dataset,
  expanded,
}: {
  id: string;
  dataset: Dataset;
  expanded: ExpandedSet;
}): Item | undefined => {
  // STEP 1
  // find parent
  // if no previous sibling, use parent
  // unless parent is root
  //
  // STEP 2
  // find previous sibling
  // recurse into that sibling's last children that are expanded

  const current = get(id, dataset);
  const parent = getParent(id, dataset);
  const mains = getMainsKeys(dataset);

  const siblings = parent && parent.children ? parent.children : mains;
  const index = siblings.indexOf(current.id);

  if (index === 0) {
    if (parent && parent.isRoot) {
      return getPrevious({ id: parent.id, dataset, expanded });
    }
    if (!parent) {
      return undefined;
    }
    return parent;
  }

  let item = get(siblings[index - 1], dataset);

  while (item.children && expanded[item.id]) {
    item = get(item.children.slice(-1)[0], dataset);
  }

  if (item.isRoot) {
    return getPrevious({ id: item.id, dataset, expanded });
  }

  return item;
};

export const getNext = ({
  id,
  dataset,
  expanded,
}: {
  id: string;
  dataset: Dataset;
  expanded: ExpandedSet;
}): Item | undefined => {
  // STEP 1:
  // find any children if the node is expanded, first child
  //
  // STEP 2
  // iterate over parents, + fake 'root':
  // - find index of last parent as child in grandparent
  // - if child has next sibling, return
  // - if not, continue iterating
  const current = get(id, dataset);

  if (!current) {
    return undefined;
  }

  const { children } = current;

  if (children && children.length && (expanded[current.id] || current.isRoot)) {
    return get(children[0], dataset);
  }

  const mains = getMainsKeys(dataset);

  // we add a face super-root, otherwise we won't be able to jump to the next root
  const superRoot = { children: mains } as Item;
  const parents = getParents(id, dataset).concat([superRoot]);

  const next = parents.reduce(
    (acc, item) => {
      if (acc.result) {
        return acc;
      }
      const parent = item;
      const siblings = parent && parent.children ? parent.children : mains;
      const index = siblings.indexOf(acc.child.id);

      if (siblings[index + 1]) {
        return { result: get(siblings[index + 1], dataset) };
      }
      return { child: parent };
    },
    { child: current, result: undefined }
  );

  if (next.result && next.result.isRoot) {
    return getNext({ id: next.result.id, dataset, expanded });
  }
  return next.result;
};

const fuse = memoize(5)(
  (dataset) =>
    new Fuse(toList(dataset), {
      threshold: FUZZY_SEARCH_THRESHOLD,
      keys: ['kind', 'name', 'parameters.fileName', 'parameters.notes'],
    })
);

const exactMatch = (filter: string) => {
  const reg = new RegExp(filter, 'i');

  return (i: Item) =>
    i.isLeaf &&
    ((isStory(i) && reg.test(i.kind)) ||
      (i.name && reg.test(i.name)) ||
      (i.parameters &&
        typeof i.parameters.fileName === 'string' &&
        reg.test(i.parameters.fileName.toString())) ||
      (i.parameters &&
        typeof i.parameters.notes === 'string' &&
        reg.test(i.parameters.notes.toString())));
};

export const toId = (base: string, addition: string) =>
  base === '' ? `${addition}` : `${base}-${addition}`;

export const filteredLength = (dataset: Dataset, filter: string) => {
  return Object.keys(toFiltered(dataset, filter)).length;
};

export const toFiltered = (dataset: Dataset, filter: string) => {
  let found: Item[];
  if (filter.length && filter.length > 2) {
    found = fuse(dataset)
      .search(filter)
      .map(({ item }) => item);
  } else {
    const matcher = exactMatch(filter);
    found = toList(dataset).filter(matcher);
  }

  // get all parents for all results
  const result = found.reduce((acc, item) => {
    if (item.isLeaf) {
      getParents(item.id, dataset).forEach((pitem) => {
        acc[pitem.id] = pitem;
      });

      acc[item.id] = item;
    }
    return acc;
  }, {} as Dataset);

  // filter the children of the found items (and their parents) so only found entries are present
  return Object.entries(result).reduce((acc, [k, v]) => {
    const r = v.children ? { ...v, children: v.children.filter((c) => !!result[c]) } : v;

    if (r.isLeaf || r.children.length) {
      acc[k] = r;
    }

    return acc;
  }, {} as Dataset);
};
