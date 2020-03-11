export { RenderContext } from '@storybook/core';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface ElementArgs {
  el: HTMLElement;
}

export interface OptionsArgs {
  template: any;
  context: any;
  element: any;
}
