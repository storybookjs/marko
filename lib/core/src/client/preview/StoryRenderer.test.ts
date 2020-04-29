import { StoryStore, defaultDecorateStory } from '@storybook/client-api';
import createChannel from '@storybook/channel-postmessage';
import {
  FORCE_RE_RENDER,
  RENDER_CURRENT_STORY,
  STORY_ERRORED,
  STORY_THREW_EXCEPTION,
  STORY_MISSING,
  DOCS_RENDERED,
  STORY_CHANGED,
  STORY_UNCHANGED,
  STORY_RENDERED,
} from '@storybook/core-events';
import { toId } from '@storybook/csf';
import addons, { StoryKind, StoryName, Parameters } from '@storybook/addons';
import ReactDOM from 'react-dom';

import { StoryRenderer } from './StoryRenderer';

jest.mock('react-dom');

jest.mock('@storybook/client-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

function prepareRenderer() {
  const render = jest.fn();
  const channel = createChannel({ page: 'preview' });
  addons.setChannel(channel);
  const storyStore = new StoryStore({ channel });
  const renderer = new StoryRenderer({ render, channel, storyStore });

  // mock out all the dom-touching functions
  renderer.applyLayout = jest.fn();
  renderer.showErrorDisplay = jest.fn();
  renderer.showNoPreview = jest.fn();
  renderer.showMain = jest.fn();
  renderer.showDocs = jest.fn();
  renderer.showStory = jest.fn();

  return { render, channel, storyStore, renderer };
}

function addAndSelectStory(
  storyStore: StoryStore,
  kind: StoryKind,
  name: StoryName,
  parameters: Parameters = {}
) {
  const id = toId(kind, name);
  storyStore.addStory(
    { id, kind, name, storyFn: jest.fn(), parameters },
    {
      applyDecorators: defaultDecorateStory,
    }
  );
  storyStore.setSelection({ storyId: id, viewMode: 'story' });
}

describe('core.preview.StoryRenderer', () => {
  it('renders the current story with the correct context', async () => {
    const { render, channel, storyStore, renderer } = prepareRenderer();
    addAndSelectStory(storyStore, 'a', '1', { p: 'q' });

    const onStoryRendered = jest.fn();
    channel.on(STORY_RENDERED, onStoryRendered);

    renderer.renderCurrentStory(false);
    expect(render).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'a--1',
        kind: 'a',
        name: '1',
        parameters: { p: 'q' },
        forceRender: false,

        showMain: expect.any(Function),
        showError: expect.any(Function),
        showException: expect.any(Function),
      })
    );

    render.mockClear();
    renderer.renderCurrentStory(true);
    expect(render).toHaveBeenCalledWith(
      expect.objectContaining({
        forceRender: true,
      })
    );

    // the render function does something async so we need to jump to the end of the promise queue
    await Promise.resolve(null);

    expect(onStoryRendered).toHaveBeenCalledWith('a--1');
  });

  describe('errors', () => {
    it('renders an error if a config error is set on the store', () => {
      const { render, storyStore, renderer } = prepareRenderer();
      const err = { message: 'message', stack: 'stack' };
      storyStore.setError(err);

      expect(render).not.toHaveBeenCalled();
      expect(renderer.showErrorDisplay).toHaveBeenCalledWith(err);
    });

    it('renders an error if the story calls renderError', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');

      const onStoryErrored = jest.fn();
      channel.on(STORY_ERRORED, onStoryErrored);

      const err = { title: 'title', description: 'description' };
      render.mockImplementation(({ showError }) => showError(err));
      renderer.renderCurrentStory(false);

      expect(renderer.showErrorDisplay).toHaveBeenCalledWith({
        message: 'title',
        stack: 'description',
      });
      expect(onStoryErrored).toHaveBeenCalledWith(err);
    });

    it('renders an exception if the story calls renderException', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');

      const onStoryThrewException = jest.fn();
      channel.on(STORY_THREW_EXCEPTION, onStoryThrewException);

      const err = { message: 'message', stack: 'stack' };
      render.mockImplementation(({ showException }) => showException(err));
      renderer.renderCurrentStory(false);

      expect(renderer.showErrorDisplay).toHaveBeenCalledWith(err);
      expect(onStoryThrewException).toHaveBeenCalledWith(err);
    });

    it('renders an exception if the render function throws', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');

      const onStoryThrewException = jest.fn();
      channel.on(STORY_THREW_EXCEPTION, onStoryThrewException);

      const err = { message: 'message', stack: 'stack' };
      render.mockImplementation(() => {
        throw err;
      });
      renderer.renderCurrentStory(false);

      expect(renderer.showErrorDisplay).toHaveBeenCalledWith(err);
      expect(onStoryThrewException).toHaveBeenCalledWith(err);
    });

    it('renders an error if the story is missing', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      storyStore.setSelection({ storyId: 'b--2', viewMode: 'story' });

      const onStoryMissing = jest.fn();
      channel.on(STORY_MISSING, onStoryMissing);

      renderer.renderCurrentStory(false);

      expect(render).not.toHaveBeenCalled();

      expect(renderer.showNoPreview).toHaveBeenCalled();
      expect(onStoryMissing).toHaveBeenCalledWith('b--2');
    });
  });

  describe('docs mode', () => {
    it('renders docs and emits when rendering a docs story', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });

      const onDocsRendered = jest.fn();
      channel.on(DOCS_RENDERED, onDocsRendered);
      ((ReactDOM.render as unknown) as jest.Mock<
        ReactDOM.Renderer
      >).mockImplementationOnce((element, node, callback) => callback());

      renderer.renderCurrentStory(false);

      // Although the docs React component may ultimately render the story we are mocking out
      // `react-dom` and just check that *something* is being rendered by react at this point
      expect(render).not.toHaveBeenCalled();
      expect(onDocsRendered).toHaveBeenCalledWith('a');
    });

    it('hides the root and shows the docs root as well as main when rendering a docs story', () => {
      const { storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });

      renderer.renderCurrentStory(false);

      expect(renderer.showDocs).toHaveBeenCalled();
      expect(renderer.showMain).toHaveBeenCalled();
    });

    it('hides the docs root and shows the root, but does not show main when rendering a normal story', () => {
      const { render, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');

      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      (renderer.showStory as jest.Mock<any>).mockClear();
      (renderer.showMain as jest.Mock<any>).mockClear();
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'story' });

      render.mockImplementationOnce(({ showMain }) => {
        // showMain has not yet been called
        expect(renderer.showStory).toHaveBeenCalled();
        expect(renderer.showMain).not.toHaveBeenCalled();

        // now the render function implementation calls showMain
        showMain();
        expect(renderer.showMain).toHaveBeenCalled();
      });
      renderer.renderCurrentStory(false);
    });
  });

  describe('re-rendering behaviour', () => {
    it('does not re-render if nothing changed', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      renderer.renderCurrentStory(false);

      const onStoryUnchanged = jest.fn();
      channel.on(STORY_UNCHANGED, onStoryUnchanged);

      render.mockClear();
      renderer.renderCurrentStory(false);
      expect(render).not.toHaveBeenCalled();
      // Not sure why STORY_UNCHANGED is called with all this stuff
      expect(onStoryUnchanged).toHaveBeenCalledWith({
        id: 'a--1',
        kind: 'a',
        name: '1',
        revision: 0,
        viewMode: 'story',
      });
    });
    it('does re-render the current story if it has not changed if forceRender is true', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      renderer.renderCurrentStory(false);

      const onStoryChanged = jest.fn();
      channel.on(STORY_CHANGED, onStoryChanged);

      render.mockClear();
      renderer.renderCurrentStory(true);
      expect(render).toHaveBeenCalled();

      expect(onStoryChanged).not.toHaveBeenCalled();
    });
    it('does re-render if the selected story changes', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      addAndSelectStory(storyStore, 'a', '2');
      renderer.renderCurrentStory(false); // renders a--2

      const onStoryChanged = jest.fn();
      channel.on(STORY_CHANGED, onStoryChanged);

      render.mockClear();
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'story' });
      renderer.renderCurrentStory(false);
      expect(render).toHaveBeenCalled();

      expect(onStoryChanged).toHaveBeenCalledWith('a--1');
    });
    it('does re-render if the store revision changes', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      renderer.renderCurrentStory(false);

      const onStoryChanged = jest.fn();
      channel.on(STORY_CHANGED, onStoryChanged);

      render.mockClear();
      storyStore.incrementRevision();
      renderer.renderCurrentStory(false);
      expect(render).toHaveBeenCalled();

      expect(onStoryChanged).not.toHaveBeenCalled();
    });
    it('does re-render if the view mode changes', () => {
      const { render, channel, storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      const onStoryChanged = jest.fn();
      channel.on(STORY_CHANGED, onStoryChanged);

      render.mockClear();
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'story' });
      renderer.renderCurrentStory(false);
      expect(render).toHaveBeenCalled();

      expect(onStoryChanged).toHaveBeenCalledWith('a--1');
    });
  });

  describe('hooks', () => {
    it('cleans up kind hooks when changing kind in docs mode', () => {
      const { storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      addAndSelectStory(storyStore, 'b', '1');
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      storyStore.cleanHooksForKind = jest.fn();

      storyStore.setSelection({ storyId: 'b--1', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      expect(storyStore.cleanHooksForKind).toHaveBeenCalledWith('a');
    });
    it('does not clean up hooks when changing story but not kind in docs mode', () => {
      const { storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      addAndSelectStory(storyStore, 'a', '2');
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      storyStore.cleanHooksForKind = jest.fn();

      storyStore.setSelection({ storyId: 'a--2', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      expect(storyStore.cleanHooksForKind).not.toHaveBeenCalled();
    });
    it('cleans up kind hooks when changing view mode from docs', () => {
      const { storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      storyStore.cleanHooksForKind = jest.fn();

      storyStore.setSelection({ storyId: 'a--1', viewMode: 'story' });
      renderer.renderCurrentStory(false);

      expect(storyStore.cleanHooksForKind).toHaveBeenCalledWith('a');
    });
    it('cleans up story hooks when changing story in story mode', () => {
      const { storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      addAndSelectStory(storyStore, 'a', '2');
      renderer.renderCurrentStory(false);

      storyStore.cleanHooks = jest.fn();

      storyStore.setSelection({ storyId: 'a--1', viewMode: 'story' });
      renderer.renderCurrentStory(false);

      expect(storyStore.cleanHooks).toHaveBeenCalledWith('a--2');
    });
    it('cleans up story hooks when changing view mode from story', () => {
      const { storyStore, renderer } = prepareRenderer();
      addAndSelectStory(storyStore, 'a', '1');
      renderer.renderCurrentStory(false);

      storyStore.cleanHooks = jest.fn();

      storyStore.setSelection({ storyId: 'a--1', viewMode: 'docs' });
      renderer.renderCurrentStory(false);

      expect(storyStore.cleanHooks).toHaveBeenCalledWith('a--1');
    });
  });

  describe('event handling', () => {
    it('renders on RENDER_CURRENT_STORY', () => {
      const { channel, renderer } = prepareRenderer();
      renderer.renderCurrentStory = jest.fn();

      channel.emit(RENDER_CURRENT_STORY);
      expect(renderer.renderCurrentStory).toHaveBeenCalledWith(false);
    });

    it('force renders on FORCE_RE_RENDER', () => {
      const { channel, renderer } = prepareRenderer();
      renderer.renderCurrentStory = jest.fn();

      channel.emit(FORCE_RE_RENDER);
      expect(renderer.renderCurrentStory).toHaveBeenCalledWith(true);
    });
  });
});
