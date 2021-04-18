import { API } from '@storybook/api';
import { ADDON_ID } from './constants';
import { MINIMAL_VIEWPORTS } from './defaults';

const viewportsKeys = Object.keys(MINIMAL_VIEWPORTS);
const getCurrentViewportIndex = (current: string): number => viewportsKeys.indexOf(current);
const getNextViewport = (current: string): string => {
  const currentViewportIndex = getCurrentViewportIndex(current);
  return currentViewportIndex === viewportsKeys.length - 1
    ? viewportsKeys[0]
    : viewportsKeys[currentViewportIndex + 1];
};
const getPreviousViewport = (current: string): string => {
  const currentViewportIndex = getCurrentViewportIndex(current);
  return currentViewportIndex < 1
    ? viewportsKeys[viewportsKeys.length - 1]
    : viewportsKeys[currentViewportIndex - 1];
};

export const registerShortcuts = async (api: API, setState: any) => {
  await api.setAddonShortcut(ADDON_ID, {
    label: 'Previous viewport',
    defaultShortcut: ['shift', 'V'],
    actionName: 'previous',
    action: () => {
      const { selected, isRotated } = api.getAddonState(ADDON_ID);
      setState({
        selected: getPreviousViewport(selected),
        isRotated,
      });
    },
  });

  await api.setAddonShortcut(ADDON_ID, {
    label: 'Next viewport',
    defaultShortcut: ['V'],
    actionName: 'next',
    action: () => {
      const { selected, isRotated } = api.getAddonState(ADDON_ID);
      setState({
        selected: getNextViewport(selected),
        isRotated,
      });
    },
  });

  await api.setAddonShortcut(ADDON_ID, {
    label: 'Reset viewport',
    defaultShortcut: ['control', 'V'],
    actionName: 'reset',
    action: () => {
      const { isRotated } = api.getAddonState(ADDON_ID);
      setState({
        selected: 'reset',
        isRotated,
      });
    },
  });
};
