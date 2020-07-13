import { document, window } from 'global';
import axe from 'axe-core';
import addons from '@storybook/addons';
import { EVENTS } from './constants';
import { Setup } from './params';

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
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
      channel.emit(EVENTS.RUNNING);

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
  const { parameters } = window.__STORYBOOK_STORY_STORE__.fromId(storyId) || {};
  return (
    parameters.a11y || {
      config: {},
      options: {
        restoreScroll: true,
      },
    }
  );
};

channel.on(EVENTS.REQUEST, run);
channel.on(EVENTS.MANUAL, run);
