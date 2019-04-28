import { load, addParameters } from '@storybook/html';
import { Wrapper } from '@storybook/components';

addParameters({
  html: {
    preventForcedRender: false, // default
  },
  options: {
    hierarchyRootSeparator: /\|/,
    docs: {
      mdxComponents: { wrapper: Wrapper },
    },
  },
});

load(require.context('../stories', true, /\.stories\.js$/), module);
load(require.context('../stories', true, /\.stories\.mdx$/), module);
