import { DOCS_MODE } from 'global';
import React, { FunctionComponent } from 'react';
import memoize from 'memoizerific';

import { Badge } from '@storybook/components';
import { Consumer, Combo, StoriesHash, Story } from '@storybook/api';

import { shortcutToHumanString } from '../libs/shortcut';

import ListItemIcon from '../components/sidebar/ListItemIcon';
import SidebarComponent from '../components/sidebar/Sidebar';

type Item = StoriesHash[keyof StoriesHash];

const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

const shortcutToHumanStringIfEnabled = (shortcuts: string[], enableShortcuts: boolean) =>
  enableShortcuts ? shortcutToHumanString(shortcuts) : null;

const createMenu = memoize(1)(
  (api, shortcutKeys, isFullscreen, showPanel, showNav, enableShortcuts) => [
    {
      id: 'S',
      title: 'Show sidebar',
      onClick: () => api.toggleNav(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.toggleNav, enableShortcuts),
      left: showNav ? <ListItemIcon icon="check" /> : <ListItemIcon />,
    },
    {
      id: 'A',
      title: 'Show addons',
      onClick: () => api.togglePanel(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.togglePanel, enableShortcuts),
      left: showPanel ? <ListItemIcon icon="check" /> : <ListItemIcon />,
    },
    {
      id: 'D',
      title: 'Change addons orientation',
      onClick: () => api.togglePanelPosition(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.panelPosition, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'F',
      title: 'Go full screen',
      onClick: api.toggleFullscreen,
      right: shortcutToHumanStringIfEnabled(shortcutKeys.fullScreen, enableShortcuts),
      left: isFullscreen ? 'check' : <ListItemIcon />,
    },
    {
      id: '/',
      title: 'Search',
      onClick: () => api.focusOnUIElement(focusableUIElements.storySearchField),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.search, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'up',
      title: 'Previous component',
      onClick: () => api.jumpToComponent(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevComponent, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'down',
      title: 'Next component',
      onClick: () => api.jumpToComponent(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextComponent, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'prev',
      title: 'Previous story',
      onClick: () => api.jumpToStory(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevStory, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'next',
      title: 'Next story',
      onClick: () => api.jumpToStory(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextStory, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'about',
      title: 'About your Storybook',
      onClick: () => api.navigate('/settings/about'),
      right: api.versionUpdateAvailable() && <Badge status="positive">Update</Badge>,
      left: <ListItemIcon />,
    },
    {
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      onClick: () => api.navigate('/settings/shortcuts'),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.shortcutsPage, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'collapse',
      title: 'Collapse all',
      onClick: () => api.collapseAll(),
      right: shortcutToHumanString(shortcutKeys.collapseAll),
      left: <ListItemIcon />,
    },
  ]
);

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

export const mapper = ({ state, api }: Combo) => {
  const {
    ui: { name, url, enableShortcuts },
    viewMode,
    storyId,
    layout: { isFullscreen, showPanel, showNav },
    storiesHash,
    storiesConfigured,
  } = state;
  const stories = DOCS_MODE
    ? collapseAllStories(storiesHash)
    : collapseDocsOnlyStories(storiesHash);

  const shortcutKeys = api.getShortcutKeys();
  return {
    loading: !storiesConfigured,
    title: name,
    url,
    stories,
    storyId,
    viewMode,
    menu: createMenu(api, shortcutKeys, isFullscreen, showPanel, showNav, enableShortcuts),
    menuHighlighted: api.versionUpdateAvailable(),
  };
};

const Sidebar: FunctionComponent<any> = props => (
  <Consumer filter={mapper}>{fromState => <SidebarComponent {...props} {...fromState} />}</Consumer>
);

export default Sidebar;
