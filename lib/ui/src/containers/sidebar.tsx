import { DOCS_MODE } from 'global';
import React, { FunctionComponent, useMemo } from 'react';
import rfdc from 'rfdc';

import { Consumer, Combo, StoriesHash, Story } from '@storybook/api';

import SidebarComponent from '../components/sidebar/Sidebar';
import { useMenu } from './menu';

export type Item = StoriesHash[keyof StoriesHash];

export const collapseAllStories = (stories: StoriesHash) => {
  // keep track of component IDs that have been rewritten to the ID of their first leaf child
  const componentIdToLeafId: Record<string, string> = {};

  // 1) remove all leaves
  const leavesRemoved = Object.values(stories).filter(
    item => !(item.isLeaf && stories[item.parent].isComponent)
  );

  // 2) make all components leaves and rewrite their ID's to the first leaf child
  const componentsFlattened = leavesRemoved.map(item => {
    const { id, isComponent, isRoot, children, ...rest } = item;

    // this is a folder, so just leave it alone
    if (!isComponent) {
      return item;
    }

    const nonLeafChildren: string[] = [];
    const leafChildren: string[] = [];
    children.forEach(child => (stories[child].isLeaf ? leafChildren : nonLeafChildren).push(child));

    if (leafChildren.length === 0) {
      return item; // pass through, we'll handle you later
    }

    const leafId = leafChildren[0];
    const component = {
      ...rest,
      id: leafId,
      kind: (stories[leafId] as Story).kind,
      isRoot: false,
      isLeaf: true,
      isComponent: true,
      children: [] as string[],
    };
    componentIdToLeafId[id] = leafId;

    // this is a component, so it should not have any non-leaf children
    if (nonLeafChildren.length !== 0) {
      throw new Error(
        `Unexpected '${item.id}': ${JSON.stringify({ isComponent, nonLeafChildren })}`
      );
    }

    return component;
  });

  // 3) rewrite all the children as needed
  const childrenRewritten = componentsFlattened.map(item => {
    if (item.isLeaf) {
      return item;
    }

    const { children, ...rest } = item;
    const rewritten = children.map(child => componentIdToLeafId[child] || child);

    return { children: rewritten, ...rest };
  });

  const result = {} as StoriesHash;
  childrenRewritten.forEach(item => {
    result[item.id] = item as Item;
  });
  return result;
};

export const collapseDocsOnlyStories = (storiesHash: StoriesHash) => {
  // keep track of component IDs that have been rewritten to the ID of their first leaf child
  const componentIdToLeafId: Record<string, string> = {};
  const docsOnlyStoriesRemoved = Object.values(storiesHash).filter(item => {
    if (item.isLeaf && item.parameters && item.parameters.docsOnly) {
      componentIdToLeafId[item.parent] = item.id;
      return false; // filter it out
    }
    return true;
  });

  const docsOnlyComponentsCollapsed = docsOnlyStoriesRemoved.map(item => {
    // collapse docs-only components
    const { isComponent, children, id } = item;
    if (isComponent && children.length === 1) {
      const leafId = componentIdToLeafId[id];
      if (leafId) {
        const collapsed = {
          ...item,
          id: leafId,
          isLeaf: true,
          children: [] as string[],
        };
        return collapsed;
      }
    }

    // update groups
    if (children) {
      const rewritten = children.map(child => componentIdToLeafId[child] || child);
      return { ...item, children: rewritten };
    }

    // pass through stories unmodified
    return item;
  });

  const result = {} as StoriesHash;
  docsOnlyComponentsCollapsed.forEach(item => {
    result[item.id] = item as Item;
  });
  return result;
};

const clone = rfdc({ circles: true });

const Sidebar: FunctionComponent<{}> = React.memo(() => {
  const mapper = ({ state, api }: Combo) => {
    const {
      ui: { name, url, enableShortcuts },
      viewMode,
      storyId,
      layout: { isFullscreen, showPanel, showNav },
      storiesHash,
      refs,
    } = state;

    const stories = useMemo(() => {
      // protect against mutation
      const copy = clone(storiesHash);

      return DOCS_MODE ? collapseAllStories(copy) : collapseDocsOnlyStories(copy);
    }, [DOCS_MODE, storiesHash]);

    const menu = useMenu(api, isFullscreen, showPanel, showNav, enableShortcuts);

    return {
      title: name,
      url,
      stories,
      refs,
      storyId,
      viewMode,
      menu,
      menuHighlighted: api.versionUpdateAvailable(),
    };
  };
  return (
    <Consumer filter={mapper}>
      {fromState => {
        return <SidebarComponent {...fromState} />;
      }}
    </Consumer>
  );
});

export default Sidebar;
