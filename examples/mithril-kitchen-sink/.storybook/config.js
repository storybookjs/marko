import { load, addParameters } from '@storybook/mithril';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../src/stories', true, /\.stories\.js$/), module);
