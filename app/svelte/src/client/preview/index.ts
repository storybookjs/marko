import { start } from '@storybook/core/client';
import { decorateStory } from './decorators';

import './globals';
import render from './render';

const { configure: coreConfigure, clientApi, forceReRender } = start(render, { decorateStory });

export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

const framework = 'svelte';
export const storiesOf = (...args: any) =>
  clientApi.storiesOf(...args).addParameters({ framework });
export const configure = (...args: any) => coreConfigure(framework, ...args);

export { forceReRender };
