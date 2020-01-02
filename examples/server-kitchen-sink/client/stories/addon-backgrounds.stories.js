export default {
  title: 'Addons/Backgrounds',
  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const Story1 = () => {};
Story1.story = {
  name: 'story 1',
  parameters: {
    server: { id: 'addons/backgrounds/story1' },
  },
};

export const Story2 = () => {};
Story2.story = {
  name: 'story 2',
  parameters: {
    server: { id: 'addons/backgrounds/story2' },
  },
};
