import { UPDATE_GLOBAL_ARGS, GLOBAL_ARGS_UPDATED } from '@storybook/core-events';
import { Args, Module, API } from '../index';

export interface SubState {
  globalArgs: Args;
}

export interface SubAPI {
  updateGlobalArgs: (newGlobalArgs: Args) => void;
}

const initGlobalArgsApi = ({ store, fullAPI }: Module) => {
  const updateGlobalArgs = (newGlobalArgs: Args) => {
    if (!fullAPI) throw new Error('Cannot set global args until api has been initialized');

    fullAPI.emit(UPDATE_GLOBAL_ARGS, newGlobalArgs);
  };

  const api: SubAPI = {
    updateGlobalArgs,
  };

  const state: SubState = {
    // Currently global args always start empty. TODO -- should this be set on the channel at init time?
    globalArgs: {},
  };

  const init = () => {
    fullAPI.on(GLOBAL_ARGS_UPDATED, (globalArgs: Args) => store.setState({ globalArgs }));
  };

  return {
    api,
    state,
    init,
  };
};

export default initGlobalArgsApi;
