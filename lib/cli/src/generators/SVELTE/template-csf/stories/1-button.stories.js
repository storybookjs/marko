import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './button.svelte';

export default {
  title: 'Button',
  component: Button,
};

export const Text = () => ({
  Component: Button,
  props: { text: 'Hello Button' },
  on: { click: action('clicked') },
});

export const Emoji = () => ({
  Component: Button,
  props: {
    text: '😀 😎 👍 💯',
  },
  on: { click: action('clicked') },
});

Emoji.parameters = { notes: 'My notes on a button with emojis' };

export const WithSomeEmojiAndAction = () => ({
  Component: Button,
  props: {
    text: '😀 😎 👍 💯',
  },
  on: {
    click: action('This was clicked'),
  },
});

WithSomeEmojiAndAction.storyName = 'with some emoji and action';
WithSomeEmojiAndAction.parameters = { notes: 'My notes on a button with emojis' };

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
