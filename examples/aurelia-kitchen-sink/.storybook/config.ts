import { configure, addDecorator } from '@storybook/aurelia';
import { withA11y } from '@storybook/addon-a11y';
import { addComponents } from '@storybook/aurelia/dist/client/preview/decorators';
import { CoolButton } from '../src/cool-button/cool-button';

addDecorator(withA11y);

const req = require.context('../src/stories', true, /\.stories\.(ts|js)$/);
function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
