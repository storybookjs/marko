/* eslint-disable prefer-destructuring */
import { start } from '@storybook/core/client';
import { ClientStoryApi, Loadable } from '@storybook/addons';

import './globals';
import render, { setFetchStoryHtml } from './render';
import { StoryFnServerReturnType, IStorybookSection, FetchStoryHtmlType } from './types';

const framework = 'server';

interface ClientApi extends ClientStoryApi<StoryFnServerReturnType> {
  setAddon(addon: any): void;
  configure(fetch: FetchStoryHtmlType, loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}

const api = start(render);

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};

const setRenderFecthAndConfigure: ClientApi['configure'] = (fetch, ...args) => {
  setFetchStoryHtml(fetch);
  api.configure(...args, framework);
};

export const configure: ClientApi['configure'] = setRenderFecthAndConfigure;
export const addDecorator: ClientApi['addDecorator'] = api.clientApi.addDecorator;
export const addParameters: ClientApi['addParameters'] = api.clientApi.addParameters;
export const clearDecorators: ClientApi['clearDecorators'] = api.clientApi.clearDecorators;
export const setAddon: ClientApi['setAddon'] = api.clientApi.setAddon;
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const getStorybook: ClientApi['getStorybook'] = api.clientApi.getStorybook;
export const raw: ClientApi['raw'] = api.clientApi.raw;
