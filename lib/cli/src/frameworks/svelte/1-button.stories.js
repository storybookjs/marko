import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './button.svelte';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    text: { control: 'text' },
  },
};

const ButtonStory = ({ onClick, ...args }) => ({
  Component: Button,
  props: args,
  on: {
    click: onClick,
  },
});

export const Text = ButtonStory.bind({});
Text.args = {
  text: 'Button',
  onClick: action('onClick'),
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  text: '😀 😎 👍 💯',
};

export const TextWithAction = () => ({
  Component: Button,
  props: {
    text: 'Trigger Action',
  },
  on: {
    click: () => action('This was clicked')(),
  },
});

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => ({
  Component: Button,
  props: {
    text: 'Go to Welcome Story',
  },
  on: {
    click: linkTo('Welcome'),
  },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
