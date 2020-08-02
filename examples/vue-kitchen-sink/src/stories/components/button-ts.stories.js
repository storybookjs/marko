import ButtonTs from './ButtonTs.vue';

export default {
  title: 'Button (Typescript)',
  component: ButtonTs,
};

export const ButtonTsStory = () => ({
  components: { ButtonTs },
  template: '<ButtonTs>Storybook has builtin Typescript support for Vue components</ButtonTs>',
});
