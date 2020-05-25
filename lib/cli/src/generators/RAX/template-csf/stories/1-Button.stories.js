import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Text from 'rax-text';

export default {
  title: 'Button',
};

export const text = () => (
  <button type="button">
    <Text>Hello Button</Text>
  </button>
);

export const Emoji = () => (
  <button onClick={action('clicked')} type="button">
    <Text role="img" aria-label="so cool">
      😀 😎 👍 💯
    </Text>
  </button>
);

Emoji.parameters = { notes: 'My notes on a button with emojis' };

export const TextWithAction = () => (
  <button onClick={action('This was clicked')} type="button">
    <Text>Trigger Action</Text>
  </button>
);

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => (
  <button onClick={linkTo('Welcome')} type="button">
    <Text>Go to Welcome Story</Text>
  </button>
);

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
