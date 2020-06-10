import { propsFromArgs } from '@storybook/vue';
import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
};

export const Rounded = (args) => ({
  args,
  components: { MyButton },
  template:
    '<my-button v-bind:color="color" v-bind:rounded="rounded">A Button with rounded edges</my-button>',
});
Rounded.argTypes = {
  rounded: { defaultValue: true },
  color: { control: { type: 'color' }, defaultValue: '#f00' },
};

export const Square = () => ({
  components: { MyButton },
  template: '<my-button :rounded="false">A Button with square edges</my-button>',
});
