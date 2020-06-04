import React from 'react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Button',
  component: Button,
};

export const Text = () => <Button onClick={action('clicked')}>Hello Button</Button>;

export const Emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

Emoji.parameters = { notes: 'My notes on a button with emojis' };

export const TextWithAction = () => (
  <Button onClick={() => action('This was clicked')()}>Trigger Action</Button>
);

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => (
  <Button onClick={linkTo('Welcome')}>Go to Welcome Story</Button>
);

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
