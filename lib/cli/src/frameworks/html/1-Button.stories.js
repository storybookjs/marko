import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Button',
  argTypes: {
    children: { control: 'text' },
  },
};

const ButtonStory = ({ onClick, children }) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = children;
  btn.addEventListener('click', onClick);
  return btn;
};

export const Text = ButtonStory.bind({});
Text.args = {
  children: 'Button',
  onClick: action('onClick'),
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  children: '😀 😎 👍 💯',
};

export const TextWithAction = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = 'Trigger Action';
  btn.addEventListener('click', () => action('This was clicked')());
  return btn;
};

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = 'Go to Welcome Story';
  btn.addEventListener('click', linkTo('Welcome'));
  return btn;
};

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
