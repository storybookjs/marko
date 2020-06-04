import { SET_STORIES, UPDATE_GLOBAL_ARGS, GLOBAL_ARGS_UPDATED } from '@storybook/core-events';
import { Args, ModuleFn } from '../index';
import { SetStoriesPayloadV2 } from '../lib/stories';

export interface SubState {
  globalArgs: Args;
}

export interface SubAPI {
  updateGlobalArgs: (newGlobalArgs: Args) => void;
}

export const init: ModuleFn = ({ store, fullAPI }) => {
  const api: SubAPI = {
    updateGlobalArgs(newGlobalArgs) {
      fullAPI.emit(UPDATE_GLOBAL_ARGS, newGlobalArgs);
    },
  };

  const state: SubState = {
    // Currently global args always start empty. TODO -- should this be set on the channel at init time?
    globalArgs: {},
  };

  const initModule = () => {
    fullAPI.on(GLOBAL_ARGS_UPDATED, (globalArgs: Args) => store.setState({ globalArgs }));
    fullAPI.on(SET_STORIES, ({ globalArgs }: SetStoriesPayloadV2) =>
      store.setState({ globalArgs })
    );
  };

  return {
    api,
    state,
    init: initModule,
  };
};
