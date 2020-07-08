import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Button, ButtonProps } from './Button';

export default {
  title: 'Button',
  component: Button,
};

const Template = (args: ButtonProps) => <Button {...args} />;

export const Text = Template.bind({});
Text.args = {
  children: 'Button',
};

export const Emoji = Template.bind({});
Emoji.args = {
  children: (
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  ),
};
Emoji.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => (
  <Button onClick={linkTo('Welcome')}>Go to Welcome Story</Button>
);
ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
