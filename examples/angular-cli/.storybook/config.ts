import { load, addParameters, addDecorator } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import addCssWarning from '../src/cssWarning';

addDecorator(withA11y);
addCssWarning();

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

// put welcome screen at the top of the list so it's the first one displayed
// FIXME: require('../src/stories');

// automatically import all story ts files that end with *.stories.ts
load(require.context('../src/stories', true, /\.stories\.ts$/), module);
load(require.context('../src/stories', true, /\.stories\.mdx$/), module);
