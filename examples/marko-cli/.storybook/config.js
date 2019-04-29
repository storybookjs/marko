import { load, addParameters } from '@storybook/marko';

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../src/stories', true, /\.stories\.js$/), module);
