import GlobalUsage from './GlobalUsage.vue';

export default {
  title: 'Example/Global Components',
  component: GlobalUsage,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GlobalUsage },
  template: '<global-usage v-bind="$props" />',
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
