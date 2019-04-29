import { load, addParameters } from '@storybook/ember';

addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  },
});

// FIXME require('../stories/index.stories');
load(require.context('../stories', true, /\.stories\.js$/), module);
