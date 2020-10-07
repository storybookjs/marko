import React, { useMemo } from 'react';

import { Badge } from '@storybook/components';
import { API } from '@storybook/api';
import { useTheme, Theme } from '@storybook/theming';

import { shortcutToHumanString } from '@storybook/api/shortcut';
import { MenuItemIcon } from '../components/sidebar/Menu';

const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

const shortcutToHumanStringIfEnabled = (shortcuts: string[], enableShortcuts: boolean) =>
  enableShortcuts ? shortcutToHumanString(shortcuts) : null;

export const useMenu = (
  api: API,
  isFullscreen: boolean,
  showPanel: boolean,
  showNav: boolean,
  enableShortcuts: boolean
) => {
  const theme = useTheme<Theme>();
  const shortcutKeys = api.getShortcutKeys();

  const about = useMemo(
    () => ({
      id: 'about',
      title: 'About your Storybook',
      onClick: () => api.navigateToSettingsPage('/settings/about'),
      right: api.versionUpdateAvailable() && <Badge status="positive">Update</Badge>,
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const releaseNotes = useMemo(
    () => ({
      id: 'release-notes',
      title: 'Release notes',
      onClick: () => api.navigateToSettingsPage('/settings/release-notes'),
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const shortcuts = useMemo(
    () => ({
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      onClick: () => api.navigateToSettingsPage('/settings/shortcuts'),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.shortcutsPage, enableShortcuts),
      left: <MenuItemIcon />,
      style: {
        borderBottom: `4px solid ${theme.appBorderColor}`,
      },
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const sidebarToggle = useMemo(
    () => ({
      id: 'S',
      title: 'Show sidebar',
      onClick: () => api.toggleNav(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.toggleNav, enableShortcuts),
      left: showNav ? <MenuItemIcon icon="check" /> : <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys, showNav]
  );

  const addonsToggle = useMemo(
    () => ({
      id: 'A',
      title: 'Show addons',
      onClick: () => api.togglePanel(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.togglePanel, enableShortcuts),
      left: showPanel ? <MenuItemIcon icon="check" /> : <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys, showPanel]
  );

  const addonsOrientationToggle = useMemo(
    () => ({
      id: 'D',
      title: 'Change addons orientation',
      onClick: () => api.togglePanelPosition(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.panelPosition, enableShortcuts),
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const fullscreenToggle = useMemo(
    () => ({
      id: 'F',
      title: 'Go full screen',
      onClick: () => api.toggleFullscreen(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.fullScreen, enableShortcuts),
      left: isFullscreen ? 'check' : <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys, isFullscreen]
  );

  const searchToggle = useMemo(
    () => ({
      id: '/',
      title: 'Search',
      onClick: () => api.focusOnUIElement(focusableUIElements.storySearchField),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.search, enableShortcuts),
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const up = useMemo(
    () => ({
      id: 'up',
      title: 'Previous component',
      onClick: () => api.jumpToComponent(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevComponent, enableShortcuts),
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const down = useMemo(
    () => ({
      id: 'down',
      title: 'Next component',
      onClick: () => api.jumpToComponent(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextComponent, enableShortcuts),
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const prev = useMemo(
    () => ({
      id: 'prev',
      title: 'Previous story',
      onClick: () => api.jumpToStory(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevStory, enableShortcuts),
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const next = useMemo(
    () => ({
      id: 'next',
      title: 'Next story',
      onClick: () => api.jumpToStory(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextStory, enableShortcuts),
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  const collapse = useMemo(
    () => ({
      id: 'collapse',
      title: 'Collapse all',
      onClick: () => api.collapseAll(),
      right: enableShortcuts ? shortcutToHumanString(shortcutKeys.collapseAll) : '',
      left: <MenuItemIcon />,
    }),
    [api, shortcutToHumanStringIfEnabled, enableShortcuts, shortcutKeys]
  );

  return useMemo(
    () => [
      about,
      ...(api.releaseNotesVersion() ? [releaseNotes] : []),
      shortcuts,
      sidebarToggle,
      addonsToggle,
      addonsOrientationToggle,
      fullscreenToggle,
      searchToggle,
      up,
      down,
      prev,
      next,
      collapse,
    ],
    [
      about,
      ...(api.releaseNotesVersion() ? [releaseNotes] : []),
      shortcuts,
      sidebarToggle,
      addonsToggle,
      addonsOrientationToggle,
      fullscreenToggle,
      searchToggle,
      up,
      down,
      prev,
      next,
      collapse,
    ]
  );
};
