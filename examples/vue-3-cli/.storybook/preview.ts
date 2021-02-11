import { Parameters, Decorators } from '@storybook/vue3';

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators: Decorators = [
  () => ({
    template: '<div id="test-div"><story /></div>',
  }),
];
