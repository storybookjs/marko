import ButtonView from './views/ButtonView.svelte';
import Button from '../components/Button.svelte';

export default {
  title: 'Button',
  component: Button,
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
  text: 'Rounded',
};

export const Square = Template.bind({});
Square.args = {
  rounded: false,
  text: 'Square',
};
