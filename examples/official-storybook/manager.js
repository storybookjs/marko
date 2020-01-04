import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

import addHeadWarning from './head-warning';

addHeadWarning('manager-head-not-loaded', 'Manager head not loaded');

addons.setConfig({
  showRoots: true,
  theme: themes.light, // { base: 'dark', brandTitle: 'Storybook!' },
  storySort: (a, b) =>
    a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
});
