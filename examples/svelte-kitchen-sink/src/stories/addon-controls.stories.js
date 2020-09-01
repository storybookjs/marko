import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Addon/Controls',
  component: ButtonView,
};

const Template = (args) => ({
  Component: ButtonView,
  props: args,
});

export const Rounded = Template.bind({});

export const Square = Template.bind({});
