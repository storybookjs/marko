import { start } from '@storybook/core/client';
import { ClientStoryApi, Loadable } from '@storybook/addons';

import './globals';
import { renderMain as render, setFetchStoryHtml } from './render';
import { StoryFnServerReturnType, IStorybookSection, ConfigureOptionsArgs } from './types';

const framework = 'server';

interface ClientApi extends ClientStoryApi<StoryFnServerReturnType> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule, options?: ConfigureOptionsArgs): void;
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

const setRenderFecthAndConfigure: ClientApi['configure'] = (loader, module, options) => {
  if (options && options.fetchStoryHtml) {
    setFetchStoryHtml(options.fetchStoryHtml);
  }
  api.configure(loader, module, framework);
};

export const configure: ClientApi['configure'] = setRenderFecthAndConfigure;
export const { addDecorator } = api.clientApi;
export const { addParameters } = api.clientApi;
export const { clearDecorators } = api.clientApi;
export const { setAddon } = api.clientApi;
export const { forceReRender } = api;
export const { getStorybook } = api.clientApi;
export const { raw } = api.clientApi;
