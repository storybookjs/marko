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
