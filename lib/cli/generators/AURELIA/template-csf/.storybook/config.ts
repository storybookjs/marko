import { configure } from '@storybook/aurelia';

configure(require.context('../src/stories', true, /\.stories\.(js|ts|mdx)$/), module);
