import { document } from 'global';
import debounce from 'lodash/debounce';
import memoize from 'memoizerific';
import axe, { AxeResults, ElementContext, RunOptions, Spec } from 'axe-core';

import addons, { DecoratorFunction } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import { Listener } from '@storybook/channels';
import { EVENTS, PARAM_KEY } from './constants';

interface Setup {
  element?: ElementContext;
  config: Spec;
  options: RunOptions;
  manual: boolean;
}

const setup: Setup = { element: undefined, config: {}, options: {}, manual: false };

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const performRun = (() => {
  let isRunning = false;

  return debounce(async (s, callback) => {
    if (isRunning) {
      return;
    }

    isRunning = true;

    await run(s)
      .then(
        (result) => callback(undefined, result),
        (error) => callback(error)
      )
      .then(() => {
        isRunning = false;
      });
  }, 100);
})();

const run = async (input: Setup) => {
  const {
    element = getElement(),
    config,
    options = {
      restoreScroll: true,
    },
  } = input;

  await axe.reset();

  if (config) {
    await axe.configure(config);
  }

  return axe.run(element, options);
};

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

let storedDefaultSetup: Setup | null = null;

const performSetup = (parameter: Partial<Setup> | undefined) => {
  if (parameter) {
    if (storedDefaultSetup === null) {
      storedDefaultSetup = { ...setup };
    }
    Object.assign(setup, parameter);
  }
  if (storedDefaultSetup !== null) {
    Object.assign(setup, storedDefaultSetup);
    storedDefaultSetup = null;
  }
};

const usePermanentChannel = memoize(1)((eventMap: Record<string, Listener>) => {
  const channel = addons.getChannel();
  const emit = channel.emit.bind(channel);

  Object.entries(eventMap).forEach(([type, handler]) => {
    channel.on(type, handler);
  });

  return emit;
});

export const withA11y: DecoratorFunction = (storyFn, storyContext) => {
  const respond = () => {
    const parameter = storyContext.parameters[PARAM_KEY] as Partial<Setup>;

    performSetup(parameter);

    performRun(setup, (error: Error, result: AxeResults) => {
      if (error) {
        emit(EVENTS.ERROR, String(error));
      } else {
        emit(EVENTS.RESULT, result);
      }
    });
  };

  const emit = usePermanentChannel({
    [EVENTS.REQUEST]: respond,
    [STORY_RENDERED]: respond,
  });

  return storyFn(storyContext);
};
