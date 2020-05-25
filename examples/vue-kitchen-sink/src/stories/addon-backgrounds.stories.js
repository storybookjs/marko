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

export const Story1 = () => {
  const content = 'You should be able to switch backgrounds for this story';

  return {
    template: `<button>${content}</button>`,
  };
};

Story1.storyName = 'story 1';

export const Story2 = () => {
  const content = 'This one too!';

  return {
    template: `<button>${content}</button>`,
  };
};

Story2.storyName = 'story 2';
