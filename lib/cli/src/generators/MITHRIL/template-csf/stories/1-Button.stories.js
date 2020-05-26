import m from 'mithril';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const Text = () => ({
  view: () => m(Button, { onclick: action('clicked') }, 'Hello Button'),
});

export const Emoji = () => ({
  view: () =>
    m(
      Button,
      { onclick: action('clicked') },
      m('span', { role: 'img', ariaLabel: 'so cool' }, '😀 😎 👍 💯')
    ),
});

Emoji.parameters = { notes: 'My notes on a button with emojis' };

export const WithSomeEmojiAndAction = () => ({
  view: () =>
    m(
      Button,
      { onclick: action('This was clicked') },
      m('span', { role: 'img', ariaLabel: 'so cool' }, '😀 😎 👍 💯')
    ),
});

WithSomeEmojiAndAction.storyName = 'with some emoji and action';
WithSomeEmojiAndAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => ({
  view: () => m(Button, { onclick: linkTo('Welcome') }, 'Go to Welcome Story'),
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
