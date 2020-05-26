export default {
  title: 'Addons/Backgrounds',
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

export const Story1 = () =>
  '<span style="color: white">You should be able to switch backgrounds for this story</span>';
Story1.storyName = 'story 1';

export const Story2 = () => '<span style="color: white">This one too!</span>';
Story2.storyName = 'story 2';
