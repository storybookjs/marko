import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Addon/Backgrounds',
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#eeeeee' },
        { name: 'dark', value: '#222222' },
      ],
    },
  },
};

export const Story1 = () => ({
  Component: ButtonView,
});

Story1.storyName = 'story 1';
