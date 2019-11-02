import { configure, addDecorator } from '@storybook/aurelia';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
configure(require.context('../src/stories', true, /\.stories\.(js|ts|mdx)$/), module);
