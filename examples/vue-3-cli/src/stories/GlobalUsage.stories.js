import GlobalUsage from './GlobalUsage.vue';

export default {
  title: 'Example/Global Components',
  component: GlobalUsage,
  argTypes: {},
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { GlobalUsage },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<global-usage v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Globally Defined',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Globally Defined',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Globally Defined',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Globally Defined',
};
