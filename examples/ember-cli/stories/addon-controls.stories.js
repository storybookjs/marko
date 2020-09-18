import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Addon/Controls',
  argTypes: {
    label: { type: { name: 'string' } },
  },
};

const Template = (args) => ({
  template: hbs`<button>{{label}}</button>`,
  context: args,
});

export const Hello = Template.bind({});
Hello.args = { label: 'Hello!' };

export const Bonjour = Template.bind({});
Bonjour.args = { label: 'Bonjour!' };
