import { mount } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';

// eslint-disable-next-line
import MyButtonRaw from 'raw-loader!./MyButton.tag';
import './MyButton.tag';

export default {
  title: 'Button',
};

export const Text = () => ({
  tags: ['<my-button>Hello Button</my-button>'],
});

export const WithScenario = () => ({
  tags: [{ content: MyButtonRaw, boundAs: 'MyButton' }],
  template: '<MyButton>With scenario</MyButton>',
});

export const WithSomeEmojiAndAction = () =>
  mount('my-button', {
    content: '😀 😎 👍 💯',
    onClick: action('This was clicked'),
  });

WithSomeEmojiAndAction.story = {
  name: 'with some emoji and action',
};

export const ButtonWithLinkToAnotherStory = () =>
  mount('my-button', {
    content: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  });

ButtonWithLinkToAnotherStory.story = {
  name: 'button with link to another story',
};
