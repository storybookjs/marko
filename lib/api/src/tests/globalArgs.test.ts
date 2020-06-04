import EventEmitter from 'event-emitter';
import { SET_STORIES, UPDATE_GLOBAL_ARGS, GLOBAL_ARGS_UPDATED } from '@storybook/core-events';

import { ModuleArgs, API } from '../index';
import { init as initModule, SubAPI } from '../modules/globalArgs';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation((s) => {
      state = { ...state, ...s };
    }),
  };
}

describe('stories API', () => {
  it('sets a sensible initialState', () => {
    const store = createMockStore();
    const { state } = initModule(({ store } as unknown) as ModuleArgs);

    expect(state).toEqual({
      globalArgs: {},
    });
  });

  it('set global args on SET_STORIES', () => {
    const api = EventEmitter();
    const store = createMockStore();
    const { state, init } = initModule(({ store, fullAPI: api } as unknown) as ModuleArgs);
    store.setState(state);
    init();

    api.emit(SET_STORIES, { globalArgs: { a: 'b' } });
    expect(store.getState()).toEqual({ globalArgs: { a: 'b' } });

    expect(state).toEqual({
      globalArgs: {},
    });
  });

  it('updates the state when the preview emits GLOBAL_ARGS_UPDATED', () => {
    const api = EventEmitter();
    const store = createMockStore();
    const { state, init } = initModule(({ store, fullAPI: api } as unknown) as ModuleArgs);
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
    const { init, api } = initModule(({ store, fullAPI } as unknown) as ModuleArgs);

    init();

    (api as SubAPI).updateGlobalArgs({ a: 'b' });
    expect(fullAPI.emit).toHaveBeenCalledWith(UPDATE_GLOBAL_ARGS, { a: 'b' });
  });
});
