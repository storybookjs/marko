import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
  argTypes: {
    color: { control: 'color' },
  },
};

export const Rounded = (args) => ({
  props: Object.keys(args),
  components: { MyButton },
  template: '<my-button :color="color" :rounded="rounded">{{label}}</my-button>',
});
Rounded.args = {
  rounded: true,
  color: '#f00',
  label: 'A Button with rounded edges',
};

export const Square = Rounded.bind();
Square.args = {
  rounded: false,
  color: '#00f',
  label: 'A Button with square edges',
};
