import Comp from './component.vue';

export default {
  title: 'Issues/11839 undefined boolean',
  component: Comp,
};

export const Primary = (args, { argTypes }) => {
  return {
    props: Object.keys(argTypes),
    components: { Comp },
    // template: '<Comp />', // this will log out `false`
    template: '<Comp v-bind="$props" />', // this will log out `undefined`
  };
};
