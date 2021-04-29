import { Meta, Story } from '@storybook/vue/types-6-0';
import Button from './Button.vue';
import { ButtonSizes } from './types';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    size: { control: { type: 'select', options: ButtonSizes } },
  },
} as Meta;

export const ButtonWithProps: Story = (args, { argTypes }) => ({
  components: { Button },
  template: '<Button :size="size">Button text</Button>',
  props: Object.keys(argTypes),
});
ButtonWithProps.args = {
  size: 'big',
};
