import { Parameters, Decorators, app } from '@storybook/vue3';
// @ts-ignore
import Button from '../src/stories/Button.vue';

// This adds a component that can be used globally in stories
app.component('GlobalButton', Button);

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators: Decorators = [
  () => ({
    template: '<div id="test-div"><story /></div>',
  }),
];
