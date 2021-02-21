import { Parameters, Decorators, app } from '@storybook/vue3';
// @ts-ignore
import Button from '../src/stories/Button.vue';

// This adds a component that can be used globally in stories
app.component('GlobalButton', Button);

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

// A toolbar item to set a global theme
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light-theme',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light-theme', title: 'Light theme' },
        { value: 'dark-theme', title: 'Dark theme' },
      ],
    },
  },
};

export const decorators: Decorators = [
  () => ({
    template: '<div id="test-div"><story /></div>',
  }),
];
