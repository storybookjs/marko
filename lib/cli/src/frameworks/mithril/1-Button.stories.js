import m from 'mithril';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    children: { control: 'text' },
  },
};

const ButtonStory = ({ children, ...args }) => ({
  view: () => m(Button, args, children),
});

export const Text = ButtonStory.bind({});
Text.args = {
  children: 'Button',
  onclick: action('onClick'),
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  children: '😀 😎 👍 💯',
};

export const TextWithAction = () => ({
  view: () => m(Button, { onclick: () => action('This was clicked')() }, 'Trigger Action'),
});

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => ({
  view: () => m(Button, { onclick: linkTo('Welcome') }, 'Go to Welcome Story'),
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
