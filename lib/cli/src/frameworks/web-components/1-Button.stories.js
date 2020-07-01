import { html } from 'lit-html';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Button',
  argTypes: {
    children: { control: 'text' },
  },
};

const ButtonStory = ({ onClick, children }) => html`
  <button @click=${onClick}>
    ${children}
  </button>
`;

export const Text = ButtonStory.bind({});
Text.args = {
  children: 'Button',
  onClick: action('onClick'),
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  children: '😀 😎 👍 💯',
};

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
