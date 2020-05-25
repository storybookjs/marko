import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
};

export const Rounded = (args) => ({
  components: { MyButton },
  template: '<my-button :color="color" :rounded="rounded">A Button with rounded edges</my-button>',
  data() {
    return args;
  },
});
Rounded.argTypes = {
  rounded: { defaultValue: true },
  color: { control: { type: 'color' }, defaultValue: '#f00' },
};

export const Square = () => ({
  components: { MyButton },
  template: '<my-button :rounded="false">A Button with square edges</my-button>',
});
