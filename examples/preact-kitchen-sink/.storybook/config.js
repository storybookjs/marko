/** @jsx h */
import { load, addParameters } from '@storybook/preact';

addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  },
});

// require('../src/stories/index.stories');
load(require.context('../src', true, /\.stories\.js$/), module);
