import Button from './Button.vue';
import { ButtonSizes } from './types';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    size: { control: { type: 'select', options: ButtonSizes } },
  },
};

export const ButtonWithProps = (args: any) => ({
  components: { Button },
  template: '<Button :size="size">Button text</Button>',
  props: Object.keys(args),
});
ButtonWithProps.args = {
  size: 'big',
};
