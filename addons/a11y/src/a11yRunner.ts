import { document, window } from 'global';
import { STORY_RENDERED } from '@storybook/core-events';
import axe, { ElementContext, RunOptions, Spec } from 'axe-core';
import addons from '@storybook/addons';
import { EVENTS } from './constants';

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

interface Setup {
  element?: ElementContext;
  config: Spec;
  options: RunOptions;
}

const channel = addons.getChannel();
let active = false;

const getElement = () => {
  const storyRoot = document.getElementById('story-root');
  return storyRoot ? storyRoot.children : document.getElementById('root');
};

const run = async (storyId: string) => {
  try {
    const input = getParams(storyId);

    if (!active) {
      active = true;
      const { element = getElement(), config, options } = input;
      axe.reset();
      if (config) {
        axe.configure(config);
      }

      const result = await axe.run(element, options);
      channel.emit(EVENTS.RESULT, result);
    }
  } catch (error) {
    channel.emit(EVENTS.ERROR, error);
  } finally {
    active = false;
  }
};

/** Returns story parameters or default ones. */
const getParams = (storyId: string): Setup => {
  // eslint-disable-next-line no-underscore-dangle
  const { parameters } = window.__STORYBOOK_STORY_STORE__._stories[storyId] || {};
  return (
    parameters.a11y || {
      config: {},
      options: {
        restoreScroll: true,
      },
    }
  );
};

channel.on(STORY_RENDERED, run);
channel.on(EVENTS.REQUEST, run);
