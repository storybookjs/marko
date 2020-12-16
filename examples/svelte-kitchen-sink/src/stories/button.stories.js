import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Button',
  component: ButtonView,
};

const Template = (args) => ({
  Component: ButtonView,
  props: {
    ...args,
  },
});

export const Rounded = Template.bind({});
Rounded.args = {
  rounded: true,
  message: 'Squared text',
};

export const Square = Template.bind({});
Square.args = {
  rounded: false,
  message: 'Squared text',
};
