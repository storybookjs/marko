import { SET_STORIES, UPDATE_GLOBALS, GLOBALS_UPDATED } from '@storybook/core-events';
import { Args, ModuleFn } from '../index';
import { SetStoriesPayloadV2 } from '../lib/stories';

export interface SubState {
  globals: Args;
}

export interface SubAPI {
  updateGlobals: (newGlobals: Args) => void;
}

export const init: ModuleFn = ({ store, fullAPI }) => {
  const api: SubAPI = {
    updateGlobals(newGlobals) {
      fullAPI.emit(UPDATE_GLOBALS, newGlobals);
    },
  };

  const state: SubState = {
    // Currently global args always start empty. TODO -- should this be set on the channel at init time?
    globals: {},
  };

  const initModule = () => {
    fullAPI.on(GLOBALS_UPDATED, (globals: Args) => store.setState({ globals }));
    fullAPI.on(SET_STORIES, ({ globals }: SetStoriesPayloadV2) => store.setState({ globals }));
  };

  return {
    api,
    state,
    init: initModule,
  };
};
