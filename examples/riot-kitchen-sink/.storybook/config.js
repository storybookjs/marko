import { load, addParameters, addDecorator } from '@storybook/riot';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

// require('../src/stories');
load(require.context('../src/stories', true, /\.stories\.js$/), module);
