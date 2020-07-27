import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Addon/Controls',
  argTypes: {
    rounded: { type: { name: 'boolean' } },
    message: { type: { name: 'string' } },
  },
};

const Template = (args) => ({
  Component: ButtonView,
  props: args,
});

export const Rounded = Template.bind({});
Rounded.args = {
  rounded: true,
  message: 'Rounded text',
};

export const Square = Template.bind({});
Square.args = {
  rounded: false,
  message: 'Squared text',
};
