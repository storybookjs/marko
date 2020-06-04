import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button } from '@storybook/angular/demo';

export default {
  title: 'Button',
  component: Button,
};

export const Text = () => ({
  component: Button,
  props: {
    text: 'Hello Button',
  },
});

export const Emoji = () => ({
  component: Button,
  props: {
    text: '😀 😎 👍 💯',
  },
});

Emoji.parameters = { notes: 'My notes on a button with emojis' };

export const TextWithAction = () => ({
  component: Button,
  props: {
    text: 'Trigger Action',
    onClick: () => action('This was clicked')(),
  },
});

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => ({
  component: Button,
  props: {
    text: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
