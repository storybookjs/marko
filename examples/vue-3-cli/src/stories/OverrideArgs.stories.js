import OverrideArgs from './OverrideArgs.vue';

// Emulate something that isn't serializable
const icons = {
  Primary: {
    template: '<span>Primary Icon</span>',
  },
  Secondary: {
    template: '<span>Secondary Icon</span>',
  },
};

export default {
  title: 'Example/Override Args',
  component: OverrideArgs,
  argTypes: {
    // To show that other props are passed through
    backgroundColor: { control: 'color' },
    icon: {
      control: {
        type: 'select',
        options: Object.keys(icons),
      },
      defaultValue: 'Primary',
    },
  },
};

const Template = (args, { argTypes }) => {
  return {
    props: Object.keys(argTypes),
    components: { OverrideArgs },
    template: '<override-args v-bind="$props" :icon="icon" />',
    setup(props) {
      return {
        icon: icons[props.icon],
      };
    },
  };
};

export const TestOne = Template.bind({});
export const TestTwo = Template.bind({});
