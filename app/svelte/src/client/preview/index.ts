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
export const storiesOf = (kind: string, m: any) =>
  clientApi.storiesOf(kind, m).addParameters({ framework });
export const configure = (loadable: any, m: any) => coreConfigure(framework, loadable, m);

export { forceReRender };
