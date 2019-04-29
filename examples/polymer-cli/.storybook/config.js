import { load, addParameters } from '@storybook/polymer';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

// FIXME require('../src/stories/index.stories');
load(require.context('../src/stories', true, /\.stories\.js$/), module);
