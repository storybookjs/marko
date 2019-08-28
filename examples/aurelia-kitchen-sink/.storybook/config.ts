import { configure, addParameters, addDecorator } from '@storybook/aurelia';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
    options: {
        hierarchyRootSeparator: /\|/,
    },
});

const req = require.context('../src/stories', true, /\.stories\.(ts|js)$/);
function loadStories() {
    req.keys().forEach(req);
}

configure(loadStories, module);