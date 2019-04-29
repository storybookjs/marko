import { load, addParameters } from '@storybook/svelte';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

// require('../src/stories');
load(require.context('../src/stories', true, /\.stories\.js$/), module);
