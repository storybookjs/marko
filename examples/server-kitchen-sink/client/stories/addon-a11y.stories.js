import { withA11y } from '@storybook/addon-a11y';

export default {
  title: 'Addons/a11y',
  decorators: [withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const Default = () => {};
Default.story = {
  parameters: {
    server: { id: 'addons/a11y/default' },
  },
};
export const Label = () => {};
Label.story = {
  parameters: {
    server: { id: 'addons/a11y/label' },
  },
};

export const Disabled = () => {};
Disabled.story = {
  parameters: {
    server: { id: 'addons/a11y/disabled' },
  },
};

export const Contrast = () => {};
Contrast.story = {
  name: 'Invalid contrast',
  parameters: {
    server: { id: 'addons/a11y/contrast' },
  },
};
