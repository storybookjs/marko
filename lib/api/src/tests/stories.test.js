import {
  STORY_ARGS_UPDATED,
  UPDATE_STORY_ARGS,
  RESET_STORY_ARGS,
  SET_STORIES,
  STORY_SPECIFIED,
} from '@storybook/core-events';
import { EventEmitter } from 'events';

import { getEventMetadata } from '../lib/events';

import { init as initStories } from '../modules/stories';

jest.mock('../lib/events');
beforeEach(() => {
  getEventMetadata.mockReturnValue({ sourceType: 'local' });
});

function createMockStore(initialState) {
  let state = initialState || {};
  return {
    getState: jest.fn(() => state),
    setState: jest.fn((s) => {
      state = { ...state, ...s };
      return Promise.resolve(state);
    }),
  };
}

const provider = { getConfig: jest.fn() };

beforeEach(() => {
  provider.getConfig.mockReturnValue({});
});

describe('stories API', () => {
  it('sets a sensible initialState', () => {
    const { state } = initStories({
      storyId: 'id',
      viewMode: 'story',
    });

    expect(state).toEqual({
      storiesConfigured: false,
      storiesHash: {},
      storyId: 'id',
      viewMode: 'story',
    });
  });
  const parameters = {};
  const storiesHash = {
    'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1', args: {} },
    'a--2': { kind: 'a', name: '2', parameters, path: 'a--2', id: 'a--2', args: {} },
    'b-c--1': {
      kind: 'b/c',
      name: '1',
      parameters,
      path: 'b-c--1',
      id: 'b-c--1',
      args: {},
    },
    'b-d--1': {
      kind: 'b/d',
      name: '1',
      parameters,
      path: 'b-d--1',
      id: 'b-d--1',
      args: {},
    },
    'b-d--2': {
      kind: 'b/d',
      name: '2',
      parameters,
      path: 'b-d--2',
      id: 'b-d--2',
      args: { a: 'b' },
    },
    'custom-id--1': {
      kind: 'b/e',
      name: '1',
      parameters,
      path: 'custom-id--1',
      id: 'custom-id--1',
      args: {},
    },
  };
  describe('setStories', () => {
    it('stores basic kinds and stories w/ correct keys', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories },
      } = initStories({ store, navigate, provider });

      provider.getConfig.mockReturnValue({ showRoots: false });
      setStories(storiesHash);

      const { storiesHash: storedStoriesHash } = store.getState();

      // We need exact key ordering, even if in theory JS doesn't guarantee it
      expect(Object.keys(storedStoriesHash)).toEqual([
        'a',
        'a--1',
        'a--2',
        'b',
        'b-c',
        'b-c--1',
        'b-d',
        'b-d--1',
        'b-d--2',
        'b-e',
        'custom-id--1',
      ]);
      expect(storedStoriesHash.a).toMatchObject({
        id: 'a',
        children: ['a--1', 'a--2'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash['a--1']).toMatchObject({
        id: 'a--1',
        parent: 'a',
        kind: 'a',
        name: '1',
        parameters,
        args: {},
      });

      expect(storedStoriesHash['a--2']).toMatchObject({
        id: 'a--2',
        parent: 'a',
        kind: 'a',
        name: '2',
        parameters,
        args: {},
      });

      expect(storedStoriesHash.b).toMatchObject({
        id: 'b',
        children: ['b-c', 'b-d', 'b-e'],
        isRoot: false,
        isComponent: false,
      });

      expect(storedStoriesHash['b-c']).toMatchObject({
        id: 'b-c',
        parent: 'b',
        children: ['b-c--1'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash['b-c--1']).toMatchObject({
        id: 'b-c--1',
        parent: 'b-c',
        kind: 'b/c',
        name: '1',
        parameters,
        args: {},
      });

      expect(storedStoriesHash['b-d']).toMatchObject({
        id: 'b-d',
        parent: 'b',
        children: ['b-d--1', 'b-d--2'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash['b-d--1']).toMatchObject({
        id: 'b-d--1',
        parent: 'b-d',
        kind: 'b/d',
        name: '1',
        parameters,
        args: {},
      });

      expect(storedStoriesHash['b-d--2']).toMatchObject({
        id: 'b-d--2',
        parent: 'b-d',
        kind: 'b/d',
        name: '2',
        parameters,
        args: { a: 'b' },
      });

      expect(storedStoriesHash['b-e']).toMatchObject({
        id: 'b-e',
        parent: 'b',
        children: ['custom-id--1'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash['custom-id--1']).toMatchObject({
        id: 'custom-id--1',
        parent: 'b-e',
        kind: 'b/e',
        name: '1',
        parameters,
        args: {},
      });
    });

    it('sets roots when showRoots = true', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories },
      } = initStories({ store, navigate, provider });

      provider.getConfig.mockReturnValue({ showRoots: true });
      setStories({
        'a-b--1': {
          kind: 'a/b',
          name: '1',
          parameters,
          path: 'a-b--1',
          id: 'a-b--1',
          args: {},
        },
      });

      const { storiesHash: storedStoriesHash } = store.getState();

      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(storedStoriesHash)).toEqual(['a', 'a-b', 'a-b--1']);
      expect(storedStoriesHash.a).toMatchObject({
        id: 'a',
        children: ['a-b'],
        isRoot: true,
        isComponent: false,
      });
      expect(storedStoriesHash['a-b']).toMatchObject({
        id: 'a-b',
        parent: 'a',
        children: ['a-b--1'],
        isRoot: false,
        isComponent: true,
      });
      expect(storedStoriesHash['a-b--1']).toMatchObject({
        id: 'a-b--1',
        parent: 'a-b',
        kind: 'a/b',
        name: '1',
        parameters,
        args: {},
      });
    });

    it('does not put bare stories into a root when showRoots = true', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories },
      } = initStories({ store, navigate, provider });

      provider.getConfig.mockReturnValue({ showRoots: true });
      setStories({
        'a--1': {
          kind: 'a',
          name: '1',
          parameters,
          path: 'a--1',
          id: 'a--1',
          args: {},
        },
      });

      const { storiesHash: storedStoriesHash } = store.getState();

      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(storedStoriesHash)).toEqual(['a', 'a--1']);
      expect(storedStoriesHash.a).toMatchObject({
        id: 'a',
        children: ['a--1'],
        isRoot: false,
        isComponent: true,
      });
      expect(storedStoriesHash['a--1']).toMatchObject({
        id: 'a--1',
        parent: 'a',
        kind: 'a',
        name: '1',
        parameters,
        args: {},
      });
    });

    // Stories can get out of order for a few reasons -- see reproductions on
    //   https://github.com/storybookjs/storybook/issues/5518
    it('does the right thing for out of order stories', async () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories },
      } = initStories({ store, navigate, provider });

      await setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1', args: {} },
        'b--1': { kind: 'b', name: '1', parameters, path: 'b--1', id: 'b--1', args: {} },
        'a--2': { kind: 'a', name: '2', parameters, path: 'a--2', id: 'a--2', args: {} },
      });

      const { storiesHash: storedStoriesHash } = store.getState();

      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(storedStoriesHash)).toEqual(['a', 'a--1', 'a--2', 'b', 'b--1']);
      expect(storedStoriesHash.a).toMatchObject({
        id: 'a',
        children: ['a--1', 'a--2'],
        isRoot: false,
        isComponent: true,
      });

      expect(storedStoriesHash.b).toMatchObject({
        id: 'b',
        children: ['b--1'],
        isRoot: false,
        isComponent: true,
      });
    });
  });

  // Can't currently run these tests as cannot set this on the events
  describe('STORY_SPECIFIED event', () => {
    it('navigates to the story', async () => {
      const navigate = jest.fn();
      const api = Object.assign(new EventEmitter(), {
        isSettingsScreenActive() {
          return false;
        },
      });
      const store = createMockStore({});
      const { init } = initStories({ store, navigate, provider, fullAPI: api });

      init();
      api.emit(STORY_SPECIFIED, { storyId: 'a--1', viewMode: 'story' });

      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    it('DOES not navigate if the story was already selected', async () => {
      const navigate = jest.fn();
      const api = Object.assign(new EventEmitter(), {
        isSettingsScreenActive() {
          return true;
        },
      });
      const store = createMockStore({ viewMode: 'story', storyId: 'a--1' });
      initStories({ store, navigate, provider, fullAPI: api });

      api.emit(STORY_SPECIFIED, { storyId: 'a--1', viewMode: 'story' });

      expect(navigate).not.toHaveBeenCalled();
    });

    it('DOES not navigate if a settings page was selected', async () => {
      const navigate = jest.fn();
      const api = Object.assign(new EventEmitter(), {
        isSettingsScreenActive() {
          return true;
        },
      });
      const store = createMockStore({ viewMode: 'settings', storyId: 'about' });
      initStories({ store, navigate, provider, fullAPI: api });

      api.emit(STORY_SPECIFIED, { storyId: 'a--1', viewMode: 'story' });

      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('args handling', () => {
    it('changes args properly, per story when receiving STORY_ARGS_UPDATED', () => {
      const navigate = jest.fn();
      const store = createMockStore();
      const api = new EventEmitter();

      const {
        api: { setStories },
        init,
      } = initStories({ store, navigate, provider, fullAPI: api });

      setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1', args: { a: 'b' } },
        'b--1': { kind: 'b', name: '1', parameters, path: 'b--1', id: 'b--1', args: { x: 'y' } },
      });

      const { storiesHash: initialStoriesHash } = store.getState();
      expect(initialStoriesHash['a--1'].args).toEqual({ a: 'b' });
      expect(initialStoriesHash['b--1'].args).toEqual({ x: 'y' });

      init();
      api.emit(STORY_ARGS_UPDATED, { storyId: 'a--1', args: { foo: 'bar' } });

      const { storiesHash: changedStoriesHash } = store.getState();
      expect(changedStoriesHash['a--1'].args).toEqual({ foo: 'bar' });
      expect(changedStoriesHash['b--1'].args).toEqual({ x: 'y' });
    });

    it('changes reffed args properly, per story when receiving STORY_ARGS_UPDATED', () => {
      const navigate = jest.fn();
      const store = createMockStore();
      const api = new EventEmitter();
      api.updateRef = jest.fn();

      const { init } = initStories({ store, navigate, provider, fullAPI: api });

      init();
      getEventMetadata.mockReturnValueOnce({
        sourceType: 'external',
        ref: { id: 'refId', stories: { 'a--1': { args: { a: 'b' } } } },
      });
      api.emit(STORY_ARGS_UPDATED, { storyId: 'a--1', args: { foo: 'bar' } });
      expect(api.updateRef).toHaveBeenCalledWith('refId', {
        stories: { 'a--1': { args: { foo: 'bar' } } },
      });
    });

    it('updateStoryArgs emits UPDATE_STORY_ARGS to the local frame and does not change anything', () => {
      const navigate = jest.fn();
      const emit = jest.fn();
      const on = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, updateStoryArgs },
        init,
      } = initStories({ store, navigate, provider, fullAPI: { emit, on } });

      setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1', args: { a: 'b' } },
        'b--1': { kind: 'b', name: '1', parameters, path: 'b--1', id: 'b--1', args: { x: 'y' } },
      });

      init();

      updateStoryArgs({ id: 'a--1' }, { foo: 'bar' });
      expect(emit).toHaveBeenCalledWith(UPDATE_STORY_ARGS, {
        storyId: 'a--1',
        updatedArgs: { foo: 'bar' },
        options: {
          target: 'storybook-preview-iframe',
        },
      });

      const { storiesHash: changedStoriesHash } = store.getState();
      expect(changedStoriesHash['a--1'].args).toEqual({ a: 'b' });
      expect(changedStoriesHash['b--1'].args).toEqual({ x: 'y' });
    });

    it('updateStoryArgs emits UPDATE_STORY_ARGS to the right frame', () => {
      const navigate = jest.fn();
      const emit = jest.fn();
      const on = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, updateStoryArgs },
        init,
      } = initStories({ store, navigate, provider, fullAPI: { emit, on } });

      setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1', args: { a: 'b' } },
        'b--1': { kind: 'b', name: '1', parameters, path: 'b--1', id: 'b--1', args: { x: 'y' } },
      });

      init();

      updateStoryArgs({ id: 'a--1', refId: 'refId' }, { foo: 'bar' });
      expect(emit).toHaveBeenCalledWith(UPDATE_STORY_ARGS, {
        storyId: 'a--1',
        updatedArgs: { foo: 'bar' },
        options: {
          target: 'storybook-ref-refId',
        },
      });
    });

    it('resetStoryArgs emits RESET_STORY_ARGS to the local frame and does not change anything', () => {
      const navigate = jest.fn();
      const emit = jest.fn();
      const on = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, resetStoryArgs },
        init,
      } = initStories({ store, navigate, provider, fullAPI: { emit, on } });

      setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1', args: { a: 'b' } },
        'b--1': { kind: 'b', name: '1', parameters, path: 'b--1', id: 'b--1', args: { x: 'y' } },
      });

      init();

      resetStoryArgs({ id: 'a--1' }, ['foo']);
      expect(emit).toHaveBeenCalledWith(RESET_STORY_ARGS, {
        storyId: 'a--1',
        argNames: ['foo'],
        options: {
          target: 'storybook-preview-iframe',
        },
      });

      const { storiesHash: changedStoriesHash } = store.getState();
      expect(changedStoriesHash['a--1'].args).toEqual({ a: 'b' });
      expect(changedStoriesHash['b--1'].args).toEqual({ x: 'y' });
    });

    it('resetStoryArgs emits RESET_STORY_ARGS to the right frame', () => {
      const navigate = jest.fn();
      const emit = jest.fn();
      const on = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, resetStoryArgs },
        init,
      } = initStories({ store, navigate, provider, fullAPI: { emit, on } });

      setStories({
        'a--1': { kind: 'a', name: '1', parameters, path: 'a--1', id: 'a--1', args: { a: 'b' } },
        'b--1': { kind: 'b', name: '1', parameters, path: 'b--1', id: 'b--1', args: { x: 'y' } },
      });

      init();

      resetStoryArgs({ id: 'a--1', refId: 'refId' }, ['foo']);
      expect(emit).toHaveBeenCalledWith(RESET_STORY_ARGS, {
        storyId: 'a--1',
        argNames: ['foo'],
        options: {
          target: 'storybook-ref-refId',
        },
      });
    });
  });

  describe('jumpToStory', () => {
    it('works forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'a--1', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(1);
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('works backwards', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'a--2', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(-1);
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    it('does nothing if you are at the last story and go forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'custom-id--1', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you are at the first story and go backward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToStory },
        state,
      } = initStories({ store, navigate, storyId: 'a--1', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToStory(-1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you have not selected a story', () => {
      const navigate = jest.fn();
      const store = { getState: () => ({ storiesHash }) };

      const {
        api: { jumpToStory },
      } = initStories({ store, navigate, provider });

      jumpToStory(1);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('jumpToComponent', () => {
    it('works forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'a--1', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(1);
      expect(navigate).toHaveBeenCalledWith('/story/b-c--1');
    });

    it('works backwards', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'b-c--1', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(-1);
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    it('does nothing if you are in the last component and go forward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'custom-id--1', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does nothing if you are at the first component and go backward', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, jumpToComponent },
        state,
      } = initStories({ store, navigate, storyId: 'a--2', viewMode: 'story', provider });
      store.setState(state);
      setStories(storiesHash);

      jumpToComponent(-1);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('selectStory', () => {
    it('navigates', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storiesHash }),
      };

      const {
        api: { selectStory },
      } = initStories({ store, navigate, provider });

      selectStory('a--2');
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('allows navigating to kind/storyname (legacy api)', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storiesHash }),
      };

      const {
        api: { selectStory },
      } = initStories({ store, navigate, provider });

      selectStory('a', '2');
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('allows navigating to storyname, without kind (legacy api)', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'story', storyId: 'a--1', storiesHash }),
      };

      const {
        api: { selectStory },
      } = initStories({ store, navigate, provider });

      selectStory(null, '2');
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('allows navigating away from the settings pages', () => {
      const navigate = jest.fn();
      const store = {
        getState: () => ({ viewMode: 'settings', storyId: 'about', storiesHash }),
      };

      const {
        api: { selectStory },
      } = initStories({ store, navigate, provider });

      selectStory('a--2');
      expect(navigate).toHaveBeenCalledWith('/story/a--2');
    });

    it('allows navigating to first story in kind on call by kind', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { selectStory, setStories },
        state,
      } = initStories({ store, navigate, provider });
      store.setState(state);
      setStories(storiesHash);

      selectStory('a');
      expect(navigate).toHaveBeenCalledWith('/story/a--1');
    });

    describe('component permalinks', () => {
      it('allows navigating to kind/storyname (legacy api)', () => {
        const navigate = jest.fn();
        const store = createMockStore();

        const {
          api: { selectStory, setStories },
          state,
        } = initStories({ store, navigate, provider });
        store.setState(state);
        setStories(storiesHash);

        selectStory('b/e', '1');
        expect(navigate).toHaveBeenCalledWith('/story/custom-id--1');
      });

      it('allows navigating to component permalink/storyname (legacy api)', () => {
        const navigate = jest.fn();
        const store = createMockStore();

        const {
          api: { selectStory, setStories },
          state,
        } = initStories({ store, navigate, provider });
        store.setState(state);
        setStories(storiesHash);

        selectStory('custom-id', '1');
        expect(navigate).toHaveBeenCalledWith('/story/custom-id--1');
      });

      it('allows navigating to first story in kind on call by kind', () => {
        const navigate = jest.fn();
        const store = createMockStore();

        const {
          api: { selectStory, setStories },
          state,
        } = initStories({ store, navigate, provider });
        store.setState(state);
        setStories(storiesHash);

        selectStory('b/e');
        expect(navigate).toHaveBeenCalledWith('/story/custom-id--1');
      });
    });
  });
  describe('v2 SET_STORIES event', () => {
    it('normalizes parameters and calls setStories for local stories', () => {
      const fullAPI = Object.assign(new EventEmitter(), {
        setStories: jest.fn(),
        setOptions: jest.fn(),
        findRef: jest.fn(),
        getCurrentParameter: jest.fn(),
      });
      const navigate = jest.fn();
      const store = createMockStore();

      const { init } = initStories({ store, navigate, provider, fullAPI });
      init();

      const setStoriesPayload = {
        v: 2,
        globalParameters: { global: 'global' },
        kindParameters: { a: { kind: 'kind' } },
        stories: { 'a--1': { kind: 'a', parameters: { story: 'story' } } },
      };
      fullAPI.emit(SET_STORIES, setStoriesPayload);

      expect(fullAPI.setStories).toHaveBeenCalledWith(
        {
          'a--1': { kind: 'a', parameters: { global: 'global', kind: 'kind', story: 'story' } },
        },
        undefined
      );
    });

    it('normalizes parameters and calls setRef for external stories', () => {
      const fullAPI = Object.assign(new EventEmitter(), {
        setStories: jest.fn(),
        findRef: jest.fn(),
        setRef: jest.fn(),
      });
      const navigate = jest.fn();
      const store = createMockStore();

      const { init } = initStories({ store, navigate, provider, fullAPI });
      init();

      getEventMetadata.mockReturnValueOnce({ sourceType: 'external', ref: { id: 'ref' } });
      const setStoriesPayload = {
        v: 2,
        globalParameters: { global: 'global' },
        kindParameters: { a: { kind: 'kind' } },
        stories: { 'a--1': { kind: 'a', parameters: { story: 'story' } } },
      };
      fullAPI.emit(SET_STORIES, setStoriesPayload);

      expect(fullAPI.setStories).not.toHaveBeenCalled();
      expect(fullAPI.setRef).toHaveBeenCalledWith(
        'ref',
        {
          id: 'ref',
          v: 2,
          globalParameters: { global: 'global' },
          kindParameters: { a: { kind: 'kind' } },
          stories: {
            'a--1': { kind: 'a', parameters: { global: 'global', kind: 'kind', story: 'story' } },
          },
        },
        true
      );
    });

    it('calls setOptions w/ first story parameter', () => {
      const fullAPI = Object.assign(new EventEmitter(), {
        setStories: jest.fn(),
        setOptions: jest.fn(),
        findRef: jest.fn(),
        getCurrentParameter: jest.fn().mockReturnValue('options'),
      });
      const navigate = jest.fn();
      const store = createMockStore();

      const { init, api } = initStories({ store, navigate, provider, fullAPI });
      init();

      store.setState({});
      const setStoriesPayload = {
        v: 2,
        globalParameters: {},
        kindParameters: { a: {} },
        stories: { 'a--1': { kind: 'a' } },
      };
      fullAPI.emit(SET_STORIES, setStoriesPayload);

      expect(fullAPI.setOptions).toHaveBeenCalledWith('options');
    });
  });
  describe('legacy (v1) SET_STORIES event', () => {
    it('calls setRef with stories', () => {
      const fullAPI = Object.assign(new EventEmitter(), {
        setStories: jest.fn(),
        findRef: jest.fn(),
        setRef: jest.fn(),
      });
      const navigate = jest.fn();
      const store = createMockStore();

      const { init } = initStories({ store, navigate, provider, fullAPI });
      init();

      getEventMetadata.mockReturnValueOnce({ sourceType: 'external', ref: { id: 'ref' } });
      const setStoriesPayload = {
        stories: { 'a--1': {} },
      };
      fullAPI.emit(SET_STORIES, setStoriesPayload);

      expect(fullAPI.setStories).not.toHaveBeenCalled();
      expect(fullAPI.setRef).toHaveBeenCalledWith(
        'ref',
        {
          id: 'ref',
          stories: {
            'a--1': {},
          },
        },
        true
      );
    });
  });
});
