import { load, addParameters } from '@storybook/angular';
import addCssWarning from '../src/cssWarning';
import { Wrapper } from '@storybook/components';

addCssWarning();

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
    docs: {
      mdxComponents: { wrapper: Wrapper },
    },
  },
});

// put welcome screen at the top of the list so it's the first one displayed
// FIXME: require('../src/stories');

// automatically import all story ts files that end with *.stories.ts
load(require.context('../src/stories', true, /\.stories\.ts$/), module);
load(require.context('../src/stories', true, /\.stories\.mdx$/), module);
