import createChannel from '@storybook/channel-postmessage';
import { toId } from '@storybook/csf';
import addons from '@storybook/addons';
import { SET_STORIES, RENDER_CURRENT_STORY } from '@storybook/core-events';

import StoryStore, { ErrorLike } from './story_store';
import { defaultDecorateStory } from './decorators';

jest.mock('@storybook/node-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

let channel;
beforeEach(() => {
  channel = createChannel({ page: 'preview' });
});

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

  describe('configuration', () => {
    it('does not allow addStory if not configuring, unless allowUsafe=true', () => {
      const store = new StoryStore({ channel });
      store.finishConfiguring();

      expect(() => addStoryToStore(store, 'a', '1', () => 0)).toThrow(
        'Cannot add a story when not configuring'
      );

      expect(() =>
        store.addStory(
          {
            kind: 'a',
            name: '1',
            storyFn: () => 0,
            parameters: {},
            id: 'a--1',
          },
          {
            applyDecorators: defaultDecorateStory,
            allowUnsafe: true,
          }
        )
      ).not.toThrow();
    });

    it('does not allow remove if not configuring, unless allowUsafe=true', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();

      expect(() => store.remove('a--1')).toThrow('Cannot remove a story when not configuring');
      expect(() => store.remove('a--1', { allowUnsafe: true })).not.toThrow();
    });

    it('does not allow removeStoryKind if not configuring, unless allowUsafe=true', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();

      expect(() => store.removeStoryKind('a')).toThrow('Cannot remove a kind when not configuring');
      expect(() => store.removeStoryKind('a', { allowUnsafe: true })).not.toThrow();
    });

    it('waits for configuration to be over before emitting SET_STORIES', () => {
      const onSetStories = jest.fn();
      channel.on(SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      addStoryToStore(store, 'a', '1', () => 0);
      expect(onSetStories).not.toHaveBeenCalled();

      store.finishConfiguring();
      expect(onSetStories).toHaveBeenCalledWith({
        stories: {
          'a--1': expect.objectContaining({
            id: 'a--1',
          }),
        },
      });
    });

    it('emits an empty SET_STORIES if no stories were added during configuration', () => {
      const onSetStories = jest.fn();
      channel.on(SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      store.finishConfiguring();
      expect(onSetStories).toHaveBeenCalledWith({ stories: {} });
    });

    it('allows configuration as second time (HMR)', () => {
      const onSetStories = jest.fn();
      channel.on(SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });
      store.finishConfiguring();

      onSetStories.mockClear();
      store.startConfiguring();
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();

      expect(onSetStories).toHaveBeenCalledWith({
        stories: {
          'a--1': expect.objectContaining({
            id: 'a--1',
          }),
        },
      });
    });
  });

  describe('HMR behaviour', () => {
    it('emits the right things after removing a story', () => {
      const onSetStories = jest.fn();
      channel.on(SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      // For hooks
      addons.setChannel(channel);

      store.startConfiguring();
      addStoryToStore(store, 'kind-1', 'story-1.1', () => 0);
      addStoryToStore(store, 'kind-1', 'story-1.2', () => 0);
      store.finishConfiguring();

      onSetStories.mockClear();
      store.startConfiguring();
      store.remove(toId('kind-1', 'story-1.1'));
      store.finishConfiguring();

      expect(onSetStories).toHaveBeenCalledWith({
        stories: {
          'kind-1--story-1-2': expect.objectContaining({
            id: 'kind-1--story-1-2',
          }),
        },
      });

      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-1', 'story-1.2'))).toBeTruthy();
    });

    it('emits the right things after removing a kind', () => {
      const onSetStories = jest.fn();
      channel.on(SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      // For hooks
      addons.setChannel(channel);

      store.startConfiguring();
      addStoryToStore(store, 'kind-1', 'story-1.1', () => 0);
      addStoryToStore(store, 'kind-1', 'story-1.2', () => 0);
      addStoryToStore(store, 'kind-2', 'story-2.1', () => 0);
      addStoryToStore(store, 'kind-2', 'story-2.2', () => 0);
      store.finishConfiguring();

      onSetStories.mockClear();
      store.startConfiguring();
      store.removeStoryKind('kind-1');
      store.finishConfiguring();

      expect(onSetStories).toHaveBeenCalledWith({
        stories: {
          'kind-2--story-2-1': expect.objectContaining({
            id: 'kind-2--story-2-1',
          }),
          'kind-2--story-2-2': expect.objectContaining({
            id: 'kind-2--story-2-2',
          }),
        },
      });

      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-2', 'story-2.1'))).toBeTruthy();
    });

    // eslint-disable-next-line jest/expect-expect
    it('should not error even if you remove a kind that does not exist', () => {
      const store = new StoryStore({ channel });
      store.removeStoryKind('kind');
    });
  });

  describe('RENDER_CURRENT_STORY', () => {
    it('is emitted when setError is called', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });

      store.setError(new Error('Something is bad!') as ErrorLike);
      expect(onRenderCurrentStory).toHaveBeenCalled();
    });

    it('is NOT emitted when setSelection is called during configuration', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });

      store.setSelection({ storyId: 'a--1', viewMode: 'story' });
      expect(onRenderCurrentStory).not.toHaveBeenCalled();
    });

    it('is emitted when configuration ends', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });

      store.finishConfiguring();
      expect(onRenderCurrentStory).toHaveBeenCalled();
    });

    it('is emitted when setSelection is called outside of configuration', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });
      store.finishConfiguring();

      onRenderCurrentStory.mockClear();
      store.setSelection({ storyId: 'a--1', viewMode: 'story' });
      expect(onRenderCurrentStory).toHaveBeenCalled();
    });
  });
});
