import React from 'react';
import * as Vue from 'vue';
import { StoryFn, StoryContext } from '@storybook/addons';

// This is cast as `any` to workaround type errors caused by Vue 2 types
const { render, h } = Vue as any;

export const prepareForInline = (storyFn: StoryFn, { args }: StoryContext) => {
  const component = storyFn();

  return React.createElement('div', {
    ref: (node?: HTMLDivElement): void => (node ? render(h(component, args), node) : null),
  });
};
