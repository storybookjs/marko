import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Addon/Controls',
  argTypes: {
    label: { type: { name: 'string' } },
  },
};

const ButtonStory = (args) => ({
  template: hbs`<button>{{label}}</button>`,
  context: args,
});

export const Hello = ButtonStory.bind({});
Hello.args = { label: 'Hello!' };

export const Bonjour = ButtonStory.bind({});
Bonjour.args = { label: 'Bonjour!' };
