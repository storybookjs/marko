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

Emoji.story = {
  parameters: { notes: 'My notes on a button with emojis' },
};

export const WithSomeEmojiAndAction = () => html`
  <button @click=${action('This was clicked')}>
    😀 😎 👍 💯
  </button>
`;

WithSomeEmojiAndAction.story = {
  name: 'with some emoji and action',
  parameters: { notes: 'My notes on a button with emojis' },
};

export const ButtonWithLinkToAnotherStory = () => html`<button @click=${linkTo('Welcome')}>
  Go to Welcome Story
</button>`;

ButtonWithLinkToAnotherStory.story = {
  name: 'button with link to another story',
};
