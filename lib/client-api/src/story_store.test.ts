import createChannel from '@storybook/channel-postmessage';
import { toId } from '@storybook/csf';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';

import StoryStore from './story_store';
import { defaultDecorateStory } from './decorators';

jest.mock('@storybook/node-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const channel = createChannel({ page: 'preview' });

// make a story and add it to the store
const addStoryToStore = (store, kind, name, storyFn, parameters = {}) =>
  store.addStory(
    {
      kind,
      name,
      storyFn,
      parameters,
      id: toId(kind, name),
    },
    {
      applyDecorators: defaultDecorateStory,
    }
  );

describe('preview.story_store', () => {
  describe('extract', () => {
    it('produces stories objects with inherited metadata', () => {
      const store = new StoryStore({ channel });

      store.addGlobalMetadata({ parameters: { global: 'global' }, decorators: [] });

      store.addKindMetadata('a', { parameters: { kind: 'kind' }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0, { story: 'story' });
      addStoryToStore(store, 'a', '2', () => 0);
      addStoryToStore(store, 'b', '1', () => 0);

      const extracted = store.extract();

      // We need exact key ordering, even if in theory JS doesn't guarantee it
      expect(Object.keys(extracted)).toEqual(['a--1', 'a--2', 'b--1']);

      // content of item should be correct
      expect(extracted['a--1']).toMatchObject({
        id: 'a--1',
        kind: 'a',
        name: '1',
        parameters: { global: 'global', kind: 'kind', story: 'story' },
      });
    });
  });

  describe('getRawStory', () => {
    it('produces a story with inherited decorators applied', () => {
      const store = new StoryStore({ channel });

      const globalDecorator = jest.fn().mockImplementation(s => s());
      store.addGlobalMetadata({ parameters: {}, decorators: [globalDecorator] });

      const kindDecorator = jest.fn().mockImplementation(s => s());
      store.addKindMetadata('a', { parameters: {}, decorators: [kindDecorator] });

      const story = jest.fn();
      addStoryToStore(store, 'a', '1', story);

      const { getDecorated } = store.getRawStory('a', '1');
      getDecorated()();

      expect(globalDecorator).toHaveBeenCalled();
      expect(kindDecorator).toHaveBeenCalled();
      expect(story).toHaveBeenCalled();
    });
  });

  describe('storySort', () => {
    it('sorts stories using given function', () => {
      const parameters = {
        options: {
          // Test function does reverse alphabetical ordering.
          storySort: (a: any, b: any): number =>
            a[1].kind === b[1].kind
              ? 0
              : -1 * a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
        },
      };
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a/a', '1', () => 0, parameters);
      addStoryToStore(store, 'a/a', '2', () => 0, parameters);
      addStoryToStore(store, 'a/b', '1', () => 0, parameters);
      addStoryToStore(store, 'b/b1', '1', () => 0, parameters);
      addStoryToStore(store, 'b/b10', '1', () => 0, parameters);
      addStoryToStore(store, 'b/b9', '1', () => 0, parameters);
      addStoryToStore(store, 'c', '1', () => 0, parameters);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'c--1',
        'b-b10--1',
        'b-b9--1',
        'b-b1--1',
        'a-b--1',
        'a-a--1',
        'a-a--2',
      ]);
    });

    it('sorts stories alphabetically', () => {
      const parameters = {
        options: {
          storySort: {
            method: 'alphabetical',
          },
        },
      };
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a/b', '1', () => 0, parameters);
      addStoryToStore(store, 'a/a', '2', () => 0, parameters);
      addStoryToStore(store, 'a/a', '1', () => 0, parameters);
      addStoryToStore(store, 'c', '1', () => 0, parameters);
      addStoryToStore(store, 'b/b10', '1', () => 0, parameters);
      addStoryToStore(store, 'b/b9', '1', () => 0, parameters);
      addStoryToStore(store, 'b/b1', '1', () => 0, parameters);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'a-a--2',
        'a-a--1',
        'a-b--1',
        'b-b1--1',
        'b-b9--1',
        'b-b10--1',
        'c--1',
      ]);
    });

    it('sorts stories in specified order or alphabetically', () => {
      const parameters = {
        options: {
          storySort: {
            method: 'alphabetical',
            order: ['b', ['bc', 'ba', 'bb'], 'a', 'c'],
          },
        },
      };
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a/b', '1', () => 0, parameters);
      addStoryToStore(store, 'a', '1', () => 0, parameters);
      addStoryToStore(store, 'c', '1', () => 0, parameters);
      addStoryToStore(store, 'b/bd', '1', () => 0, parameters);
      addStoryToStore(store, 'b/bb', '1', () => 0, parameters);
      addStoryToStore(store, 'b/ba', '1', () => 0, parameters);
      addStoryToStore(store, 'b/bc', '1', () => 0, parameters);
      addStoryToStore(store, 'b', '1', () => 0, parameters);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'b--1',
        'b-bc--1',
        'b-ba--1',
        'b-bb--1',
        'b-bd--1',
        'a--1',
        'a-b--1',
        'c--1',
      ]);
    });

    it('sorts stories in specified order or by configure order', () => {
      const parameters = {
        options: {
          storySort: {
            method: 'configure',
            order: ['b', 'a', 'c'],
          },
        },
      };
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a/b', '1', () => 0, parameters);
      addStoryToStore(store, 'a', '1', () => 0, parameters);
      addStoryToStore(store, 'c', '1', () => 0, parameters);
      addStoryToStore(store, 'b/bd', '1', () => 0, parameters);
      addStoryToStore(store, 'b/bb', '1', () => 0, parameters);
      addStoryToStore(store, 'b/ba', '1', () => 0, parameters);
      addStoryToStore(store, 'b/bc', '1', () => 0, parameters);
      addStoryToStore(store, 'b', '1', () => 0, parameters);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'b--1',
        'b-bd--1',
        'b-bb--1',
        'b-ba--1',
        'b-bc--1',
        'a--1',
        'a-b--1',
        'c--1',
      ]);
    });
  });

  describe('emitting behaviour', () => {
    it('is syncronously emits STORY_RENDER if the channel is defined', async () => {
      const onChannelRender = jest.fn();
      const testChannel = createChannel({ page: 'preview' });
      testChannel.on(Events.STORY_RENDER, onChannelRender);

      const onStoreRender = jest.fn();
      const store = new StoryStore({ channel: testChannel });
      store.on(Events.STORY_RENDER, onStoreRender);

      store.setSelection({ storyId: 'storyId', viewMode: 'viewMode' }, undefined);
      expect(onChannelRender).toHaveBeenCalled();
      expect(onStoreRender).not.toHaveBeenCalled();

      onChannelRender.mockClear();
      await new Promise(r => setTimeout(r, 10));
      expect(onChannelRender).not.toHaveBeenCalled();
      expect(onStoreRender).toHaveBeenCalled();
    });

    it('is asychronously emits STORY_RENDER if the channel is not yet defined', async () => {
      const onChannelRender = jest.fn();
      const testChannel = createChannel({ page: 'preview' });
      testChannel.on(Events.STORY_RENDER, onChannelRender);

      const onStoreRender = jest.fn();
      const store = new StoryStore({ channel: undefined });
      store.on(Events.STORY_RENDER, onStoreRender);

      store.setSelection({ storyId: 'storyId', viewMode: 'viewMode' }, undefined);
      expect(onChannelRender).not.toHaveBeenCalled();
      expect(onStoreRender).not.toHaveBeenCalled();

      store.setChannel(testChannel);
      await new Promise(r => setTimeout(r, 10));
      expect(onChannelRender).toHaveBeenCalled();
      expect(onStoreRender).toHaveBeenCalled();
    });
  });

  describe('removeStoryKind', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should not error even if there is no kind', () => {
      const store = new StoryStore({ channel });
      store.removeStoryKind('kind');
    });
    it('should remove the kind', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      addStoryToStore(store, 'kind-1', 'story-1.1', () => 0);
      addStoryToStore(store, 'kind-1', 'story-1.2', () => 0);
      addStoryToStore(store, 'kind-2', 'story-2.1', () => 0);
      addStoryToStore(store, 'kind-2', 'story-2.2', () => 0);

      store.removeStoryKind('kind-1');

      // _data
      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-2', 'story-2.1'))).toBeTruthy();
    });
  });

  describe('remove', () => {
    it('should remove the story', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      addStoryToStore(store, 'kind-1', 'story-1.1', () => 0);
      addStoryToStore(store, 'kind-1', 'story-1.2', () => 0);

      store.remove(toId('kind-1', 'story-1.1'));

      // _data
      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-1', 'story-1.2'))).toBeTruthy();
    });
  });
});
