import { StoriesHash } from '@storybook/api';
import { collapseDocsOnlyStories, collapseAllStories } from './data';

type Item = StoriesHash[keyof StoriesHash];

const docsOnly = { parameters: { docsOnly: true } };
const root: Item = {
  id: 'root',
  name: 'root',
  depth: 0,
  children: ['a', 'b'],
  isRoot: true,
  isComponent: false,
  isLeaf: false,
};
const a: Item = {
  id: 'a',
  name: 'a',
  depth: 1,
  isComponent: true,
  isRoot: false,
  isLeaf: false,
  parent: 'root',
  children: ['a1'],
};
const a1: Item = {
  id: 'a1',
  name: 'a1',
  kind: 'a',
  depth: 2,
  isLeaf: true,
  isComponent: false,
  isRoot: false,
  parent: 'a',
  args: {},
};
const b: Item = {
  id: 'b',
  name: 'b',
  depth: 1,
  isRoot: false,
  isComponent: true,
  isLeaf: false,
  parent: 'root',
  children: ['b1', 'b2'],
};
const b1: Item = {
  id: 'b1',
  name: 'b1',
  kind: 'b',
  depth: 2,
  isLeaf: true,
  isRoot: false,
  isComponent: false,
  parent: 'b',
  args: {},
};
const b2: Item = {
  id: 'b2',
  name: 'b2',
  kind: 'b',
  depth: 2,
  isLeaf: true,
  isRoot: false,
  isComponent: false,
  parent: 'b',
  args: {},
};

const stories: StoriesHash = { root, a, a1, b, b1, b2 };

// this seems to work as intended
describe('collapse docs-only stories', () => {
  it('ignores normal stories', () => {
    const filtered = collapseDocsOnlyStories(stories);
    expect(filtered).toEqual(stories);
  });

  it('filters out docs-only stories', () => {
    const hasDocsOnly: StoriesHash = {
      ...stories,
      a1: { ...a1, parameters: { ...a1.parameters, ...docsOnly.parameters } },
    };
    const filtered = collapseDocsOnlyStories(hasDocsOnly);

    expect(filtered.root.children).not.toContain(hasDocsOnly.a.id);
    expect(filtered.root.children).toContain(hasDocsOnly.a1.id);
    expect(filtered.root.children).toContain(hasDocsOnly.b.id);

    expect(filtered.a).not.toBeDefined();
  });
});

describe('collapse all stories', () => {
  it('collapses normal stories', () => {
    const collapsed = collapseAllStories(stories);

    const expected: StoriesHash = {
      a1: {
        id: 'a1',
        depth: 1,
        name: 'a',
        kind: 'a',
        parent: 'root',
        children: [],
        isRoot: false,
        isComponent: true,
        isLeaf: true,
        args: {},
      },
      b1: {
        id: 'b1',
        depth: 1,
        name: 'b',
        kind: 'b',
        parent: 'root',
        children: [],
        isRoot: false,
        isComponent: true,
        isLeaf: true,
        args: {},
      },
      root: {
        id: 'root',
        name: 'root',
        depth: 0,
        children: ['a1', 'b1'],
        isRoot: true,
        isComponent: false,
        isLeaf: false,
      },
    };

    expect(collapsed).toEqual(expected);
  });

  it('collapses docs-only stories', () => {
    const hasDocsOnly: StoriesHash = {
      ...stories,
      a1: { ...a1, parameters: { ...a1.parameters, ...docsOnly.parameters } },
    };

    const collapsed = collapseAllStories(hasDocsOnly);

    expect(collapsed.a1).toEqual({
      id: 'a1',
      name: 'a',
      kind: 'a',
      depth: 1,
      isComponent: true,
      isLeaf: true,
      isRoot: false,
      parent: 'root',
      children: [],
      args: {},
    });
  });

  it('collapses mixtures of leaf and non-leaf children', () => {
    const mixedRoot: Item = {
      id: 'root',
      name: 'root',
      depth: 0,
      isRoot: true,
      isComponent: false,
      isLeaf: false,
      children: ['a', 'b1'],
    };

    const mixed: StoriesHash = {
      root: mixedRoot,
      a,
      a1,
      b1: { ...b1, depth: 1, parent: 'root' },
    };
    const collapsed = collapseAllStories(mixed);

    expect(collapsed).toEqual({
      a1: {
        id: 'a1',
        depth: 1,
        name: 'a',
        kind: 'a',
        isRoot: false,
        isComponent: true,
        isLeaf: true,
        parent: 'root',
        children: [],
        args: {},
      },
      b1: {
        id: 'b1',
        name: 'b1',
        kind: 'b',
        depth: 1,
        isLeaf: true,
        isComponent: false,
        isRoot: false,
        parent: 'root',
        args: {},
      },
      root: {
        id: 'root',
        name: 'root',
        depth: 0,
        children: ['a1', 'b1'],
        isRoot: true,
        isComponent: false,
        isLeaf: false,
      },
    });
  });
});
