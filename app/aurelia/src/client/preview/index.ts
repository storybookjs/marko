import { Constructable, CustomElement } from 'aurelia';
/* eslint-disable prefer-destructuring */
import { start } from '@storybook/core/client';
import { ClientStoryApi, Loadable } from '@storybook/addons';
import { text, boolean, number, date } from '@storybook/addon-knobs';

import './globals';
import render from './render';
import { IStorybookSection, StoryFnAureliaReturnType } from './types';
import { addRegistries, addContainer, Component, addComponents } from './decorators';

const framework = 'Aurelia';

interface ClientApi extends ClientStoryApi<Partial<StoryFnAureliaReturnType>> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
  load: (...args: any[]) => void;
}

const api = start(render);

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};

export { StoryFnAureliaReturnType, addRegistries, addContainer, Component, addComponents };

export const configure: ClientApi['configure'] = (...args) => api.configure(framework, ...args);
export const addDecorator: ClientApi['addDecorator'] = api.clientApi.addDecorator;
export const addParameters: ClientApi['addParameters'] = api.clientApi.addParameters;
export const clearDecorators: ClientApi['clearDecorators'] = api.clientApi.clearDecorators;
export const setAddon: ClientApi['setAddon'] = api.clientApi.setAddon;
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const getStorybook: ClientApi['getStorybook'] = api.clientApi.getStorybook;
export const raw: ClientApi['raw'] = api.clientApi.raw;

export function generateKnobsFor(CustomElementClass: Constructable) {
  const def = CustomElement.getDefinition(CustomElementClass);
  const bindables = def && def.bindables;

  if (!bindables) return class {};
  const result = class {} as any;
  const elementConstructed = new CustomElementClass() as any;

  Object.keys(bindables)
    .map((y) => bindables[y])
    .forEach((bindableDef) => {
      const bindable = bindableDef.property;
      const currentVal = elementConstructed[bindable];
      switch (typeof currentVal) {
        case 'boolean':
          result[bindable] = boolean(bindable, elementConstructed[bindable]);
          return;
        case 'string':
          result[bindable] = text(bindable, elementConstructed[bindable] || 'lorem ipsum');
          return;
        case 'number':
        case 'bigint':
          result[bindable] = number(bindable, elementConstructed[bindable] || 0);
          return;
        case 'undefined':
          if (bindable.toLocaleLowerCase().includes('is')) {
            result[bindable] = boolean(bindable, elementConstructed[bindable]);
            return;
          }
          if (
            bindable.toLocaleLowerCase().includes('count') ||
            bindable.toLocaleLowerCase().includes('max') ||
            bindable.toLocaleLowerCase().includes('min')
          ) {
            result[bindable] = number(bindable, elementConstructed[bindable] || 0);
            return;
          }
          if (
            bindable.toLocaleLowerCase().includes('date') ||
            bindable.toLocaleLowerCase().includes('time')
          ) {
            result[bindable] = date(bindable, elementConstructed[bindable] || new Date());
            return;
          }
          result[bindable] = text(bindable, elementConstructed[bindable] || 'lorem ipsum');
          return;
        case 'object':
          if (currentVal instanceof Date) {
            result[bindable] = date(bindable, elementConstructed[bindable] || new Date());
            return;
          }
          if (currentVal instanceof Date) {
            result[bindable] = date(bindable, elementConstructed[bindable] || new Date());
            return;
          }
          return;
        default:
          result[bindable] = text(bindable, elementConstructed[bindable] || 'lorem ipsum');
      }
    });
  return result;
}
