import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import RaxText from 'rax-text';

export default {
  title: 'Button',
  argTypes: {
    children: { control: 'text' },
  },
};

const ButtonStory = ({ children, ...args }) => (
  <button type="button" {...args}>
    <RaxText>{children}</RaxText>
  </button>
);

export const Text = ButtonStory.bind({});
Text.args = {
  children: 'Button',
  onClick: action('onClick'),
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  children: '😀 😎 👍 💯',
};

export const TextWithAction = () => (
  <button onClick={() => action('This was clicked')()} type="button">
    <RaxText>Trigger Action</RaxText>
  </button>
);

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => (
  <button onClick={linkTo('Welcome')} type="button">
    <RaxText>Go to Welcome Story</RaxText>
  </button>
);

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
