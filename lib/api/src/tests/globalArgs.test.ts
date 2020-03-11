import EventEmitter from 'event-emitter';
import { UPDATE_GLOBAL_ARGS, GLOBAL_ARGS_UPDATED } from '@storybook/core-events';

import { Module, API } from '../index';
import initGlobalArgs from '../modules/globalArgs';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = { ...state, ...s };
    }),
  }; // as unknown) as Module['store'];
}

// function createMockModule() {
//   // This mock module doesn't have all the fields but we don't use them all in this sub-module
//   return ({  as unknown) as Module;
// }

describe('stories API', () => {
  it('sets a sensible initialState', () => {
    const store = createMockStore();
    const { state } = initGlobalArgs(({ store } as unknown) as Module);

    expect(state).toEqual({
      globalArgs: {},
    });
  });

  it('updates the state when the preview emits GLOBAL_ARGS_UPDATED', () => {
    const api = EventEmitter();
    const store = createMockStore();
    const { state, init } = initGlobalArgs(({ store, fullAPI: api } as unknown) as Module);
    store.setState(state);

    init();

    api.emit(GLOBAL_ARGS_UPDATED, { a: 'b' });
    expect(store.getState()).toEqual({ globalArgs: { a: 'b' } });

    api.emit(GLOBAL_ARGS_UPDATED, { a: 'c' });
    expect(store.getState()).toEqual({ globalArgs: { a: 'c' } });

    // SHOULD NOT merge global args
    api.emit(GLOBAL_ARGS_UPDATED, { d: 'e' });
    expect(store.getState()).toEqual({ globalArgs: { d: 'e' } });
  });

  it('emits UPDATE_GLOBAL_ARGS when updateGlobalArgs is called', () => {
    const fullAPI = ({ emit: jest.fn(), on: jest.fn() } as unknown) as API;
    const store = createMockStore();
    const { init, api } = initGlobalArgs(({ store, fullAPI } as unknown) as Module);

    init();

    api.updateGlobalArgs({ a: 'b' });
    expect(fullAPI.emit).toHaveBeenCalledWith(UPDATE_GLOBAL_ARGS, { a: 'b' });
  });
});
