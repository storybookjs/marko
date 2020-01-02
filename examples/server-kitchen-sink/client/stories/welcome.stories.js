import { withLinks } from '@storybook/addon-links';

export default {
  title: 'Welcome',
  decorators: [withLinks],
};

export const Welcome = () => {};
Welcome.story = {
  parameters: {
    server: { id: 'welcome/welcome' },
  },
};
