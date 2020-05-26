import Welcome from './welcome.svelte';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = () => ({
  Component: Welcome,
  props: {},
});

ToStorybook.storyName = 'to Storybook';
