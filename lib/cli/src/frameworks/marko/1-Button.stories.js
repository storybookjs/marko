import { action } from '@storybook/addon-actions';
import Button from './Button.marko';

export default {
  title: 'Button',
  argTypes: {
    children: { control: 'text' },
  },
};

const ButtonStory = (args) => ({
  component: Button,
  input: args,
});

export const Text = ButtonStory.bind({});
Text.args = {
  children: 'Button',
  onClick: action('onClick'),
};
