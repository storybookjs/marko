// Just going to use the Button component for this example
import MyButton from './Button.vue';

const withTheme = (Story, context) => {
  return {
    data() {
      return {
        theme: context.globals.theme,
      };
    },
    template: `<div class="theme" :class="theme"><story /></div>`,
  };
};

export default {
  title: 'Example/Theme Decorator',
  component: MyButton,
  argTypes: {
    backgroundColor: { control: 'color' },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
    onClick: {},
  },
  decorators: [withTheme],
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MyButton },
  template: '<my-button @click="onClick" v-bind="$props" />',
});

export const ButtonWithTheme = Template.bind({});
ButtonWithTheme.args = {
  primary: true,
  label: 'Button',
};
