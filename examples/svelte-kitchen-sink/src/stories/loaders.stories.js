import Button from '../components/Button.svelte';

export default {
  title: 'Async Loaders',
  component: Button,
};

export const AsyncLoaders = (args, { loaded: { text } = {} }) => ({
  Component: Button,
  props: {
    ...args,
    text,
  },
});

AsyncLoaders.loaders = [async () => ({ text: 'asynchronous value' })];
