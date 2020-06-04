import { html } from 'lit-html';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Button',
};

export const Text = () => html`
  <button @click=${action('clicked')}>
    Hello Button
  </button>
`;

export const Emoji = () => html`
  <button @click=${action('clicked')}>
    😀 😎 👍 💯
  </button>
`;

Emoji.parameters = { notes: 'My notes on a button with emojis' };

export const TextWithAction = () => html`
  <button @click=${() => action('This was clicked')()}>
    Trigger Action
  </button>
`;

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => html`<button @click=${linkTo('Welcome')}>
  Go to Welcome Story
</button>`;

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
