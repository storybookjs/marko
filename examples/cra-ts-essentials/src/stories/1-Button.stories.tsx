import React from 'react';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Button',
  component: Button,
  argTypes: { onClick: { action: 'clicked' } },
};

const ButtonStory = (args: any) => <Button {...args} />;

export const Text = ButtonStory.bind({});
Text.args = {
  children: 'Hello button',
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  children: '😀 😎 👍 💯',
};
