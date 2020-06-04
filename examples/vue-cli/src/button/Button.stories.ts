import Button from './Button.vue';
import { ButtonSizes } from './types';

export default {
  title: 'Button',
  component: Button,
};

export const ButtonWithProps = (args: any) => ({
  components: { Button },
  template: '<Button :size="size">Button text</Button>',
  data() {
    return args;
  },
});
ButtonWithProps.argTypes = {
  size: { control: { type: 'select', options: ButtonSizes } },
};
