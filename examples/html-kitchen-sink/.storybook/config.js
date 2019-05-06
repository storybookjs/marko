import { load, addParameters } from '@storybook/html';

addParameters({
  html: {
    preventForcedRender: false, // default
  },
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../stories', true, /\.stories\.js$/), module);
load(require.context('../stories', true, /\.stories\.mdx$/), module);
