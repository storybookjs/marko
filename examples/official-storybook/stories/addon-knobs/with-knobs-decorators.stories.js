import { withKnobs, text } from '@storybook/addon-knobs';

export default {
  title: 'Addons/Knobs/with decorators',
};

export const WithDecoratorCallingStoryFunctionMoreThanOnce = () => {
  return text('Text', 'Hello');
};
WithDecoratorCallingStoryFunctionMoreThanOnce.decorators = [
  withKnobs,
  (storyFn) => {
    storyFn();
    return storyFn();
  },
];
