import { Args } from '@storybook/addons';
import { CHANGE_GLOBAL_ARGS, GLOBAL_ARGS_CHANGED } from '@storybook/core-events';

import { Module, API } from '../index';

export interface SubState {
  globalArgs: Args;
}

export interface SubAPI {
  setGlobalArgs: (newGlobalArgs: Args) => void;
}

const initGlobalArgsApi = ({ store }: Module) => {
  let fullApi: API;
  const setGlobalArgs = (newGlobalArgs: Args) => {
    if (!fullApi) throw new Error('Cannot set global args until api has been initialized');

    fullApi.emit(CHANGE_GLOBAL_ARGS, newGlobalArgs);
  };

  const api: SubAPI = {
    setGlobalArgs,
  };

  const state: SubState = {
    // Currently global args always start empty. TODO -- should this be set on the channel at init time?
    globalArgs: {},
  };

  const init = ({ api: inputApi }: { api: API }) => {
    fullApi = inputApi;
    fullApi.on(GLOBAL_ARGS_CHANGED, (globalArgs: Args) => store.setState({ globalArgs }));
  };

  return {
    api,
    state,
    init,
  };
};

export default initGlobalArgsApi;
