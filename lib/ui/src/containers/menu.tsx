import React from 'react';
import memoize from 'memoizerific';

import { Badge } from '@storybook/components';

import { shortcutToHumanString } from '../libs/shortcut';
import { MenuItemIcon } from '../components/sidebar/Menu';

const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

const shortcutToHumanStringIfEnabled = (shortcuts: string[], enableShortcuts: boolean) =>
  enableShortcuts ? shortcutToHumanString(shortcuts) : null;

export const createMenu = memoize(1)(
  (api, shortcutKeys, isFullscreen, showPanel, showNav, enableShortcuts) => [
    {
      id: 'S',
      title: 'Show sidebar',
      onClick: () => api.toggleNav(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.toggleNav, enableShortcuts),
      left: showNav ? <MenuItemIcon icon="check" /> : <MenuItemIcon />,
    },
    {
      id: 'A',
      title: 'Show addons',
      onClick: () => api.togglePanel(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.togglePanel, enableShortcuts),
      left: showPanel ? <MenuItemIcon icon="check" /> : <MenuItemIcon />,
    },
    {
      id: 'D',
      title: 'Change addons orientation',
      onClick: () => api.togglePanelPosition(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.panelPosition, enableShortcuts),
      left: <MenuItemIcon />,
    },
    {
      id: 'F',
      title: 'Go full screen',
      onClick: () => api.toggleFullscreen(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.fullScreen, enableShortcuts),
      left: isFullscreen ? 'check' : <MenuItemIcon />,
    },
    {
      id: '/',
      title: 'Search',
      onClick: () => api.focusOnUIElement(focusableUIElements.storySearchField),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.search, enableShortcuts),
      left: <MenuItemIcon />,
    },
    {
      id: 'up',
      title: 'Previous component',
      onClick: () => api.jumpToComponent(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevComponent, enableShortcuts),
      left: <MenuItemIcon />,
    },
    {
      id: 'down',
      title: 'Next component',
      onClick: () => api.jumpToComponent(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextComponent, enableShortcuts),
      left: <MenuItemIcon />,
    },
    {
      id: 'prev',
      title: 'Previous story',
      onClick: () => api.jumpToStory(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevStory, enableShortcuts),
      left: <MenuItemIcon />,
    },
    {
      id: 'next',
      title: 'Next story',
      onClick: () => api.jumpToStory(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextStory, enableShortcuts),
      left: <MenuItemIcon />,
    },
    {
      id: 'about',
      title: 'About your Storybook',
      onClick: () => api.navigate('/settings/about'),
      right: api.versionUpdateAvailable() && <Badge status="positive">Update</Badge>,
      left: <MenuItemIcon />,
    },
    {
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      onClick: () => api.navigate('/settings/shortcuts'),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.shortcutsPage, enableShortcuts),
      left: <MenuItemIcon />,
    },
    {
      id: 'collapse',
      title: 'Collapse all',
      onClick: () => api.collapseAll(),
      right: shortcutToHumanString(shortcutKeys.collapseAll),
      left: <MenuItemIcon />,
    },
  ]
);
