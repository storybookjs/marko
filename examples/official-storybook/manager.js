import { addons } from '@storybook/addons';

import addHeadWarning from './head-warning';

addHeadWarning('manager-head-not-loaded', 'Manager head not loaded');

addons.setConfig({
  previewTabs: {
    canvas: null,
    'storybook/docs/panel': null,
    'storybookjs/notes/panel': { title: 'Annotations', hidden: true },
    graphiql: {
      hidden: true,
    },
  },
});
