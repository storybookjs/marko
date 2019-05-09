import { load, addParameters, addDecorator } from '@storybook/ember';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  },
});

// FIXME require('../stories/index.stories');
load(require.context('../stories', true, /\.stories\.js$/), module);
