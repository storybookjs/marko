import ErrorView from './views/ErrorView.svelte';

export default {
  title: 'Error',
  component: ErrorView,
  parameters: {
    chromatic: { disable: true },
    storyshots: { disable: true },
  },
};

export const Error = () => ({
  Component: ErrorView,
});
