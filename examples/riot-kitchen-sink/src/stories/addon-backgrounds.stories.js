import ButtonRaw from './Button.txt';

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
    tags: [{ boundAs: 'my-button', content: ButtonRaw }],
    template: `<my-button>${content}</my-button>`,
  };
};

Story1.storyName = 'story 1';

export const Story2 = () => {
  const content = 'This one too!';

  return {
    tags: [{ boundAs: 'my-button', content: ButtonRaw }],
    template: `<my-button>${content}</my-button>`,
  };
};

Story2.storyName = 'story 2';
