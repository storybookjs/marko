import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Addon/Controls',
  argTypes: {
    rounded: { type: { name: 'boolean' } },
    message: { type: { name: 'string' } },
  },
};

const ButtonStory = (args) => ({
  Component: ButtonView,
  props: args,
});

export const Rounded = ButtonStory.bind({});
Rounded.args = {
  rounded: true,
  message: 'Rounded text',
};

export const Square = ButtonStory.bind({});
Square.args = {
  rounded: false,
  message: 'Squared text',
};
