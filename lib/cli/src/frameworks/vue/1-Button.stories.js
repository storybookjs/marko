import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import MyButton from './Button.vue';

export default {
  title: 'Button',
  component: MyButton,
};

const ButtonStory = (args) => ({
  props: Object.keys(args),
  components: { MyButton },
  template: '<my-button @click="onClick">{{children}}</my-button>',
});

export const Text = ButtonStory.bind({});
Text.args = {
  children: 'Button',
  onClick: action('onClick'),
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  children: '😀 😎 👍 💯',
};

export const TextWithAction = () => ({
  components: { MyButton },
  template: '<my-button @click="action">Trigger Action</my-button>',
  methods: { action: () => action('This was clicked')() },
});

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => ({
  components: { MyButton },
  template: '<my-button @click="action">Go to Welcome Story</my-button>',
  methods: { action: linkTo('Welcome') },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
