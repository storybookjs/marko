import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import MyButton from './MyButton.vue';

export default {
  title: 'Button',
  component: MyButton,
};

export const Text = () => ({
  components: { MyButton },
  template: '<my-button @click="action">Hello Button</my-button>',
  methods: { action: action('clicked') },
});

export const WithSomeEmojiAndAction = () => ({
  components: { MyButton },
  template: '<my-button @click="action">😀 😎 👍 💯</my-button>',
  methods: { action: action('This was clicked') },
});

WithSomeEmojiAndAction.storyName = 'with some emoji and action';
WithSomeEmojiAndAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => ({
  components: { MyButton },
  template: '<my-button @click="action">Go to Welcome Story</my-button>',
  methods: { action: linkTo('Welcome') },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
