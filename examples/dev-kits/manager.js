import '@storybook/addon-roundtrip/register';
import '@storybook/addon-parameter/register';
import '@storybook/addon-preview-wrapper/register';

import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

import logo from './logo.svg';

addons.setConfig({
  theme: {
    brandImage: logo,
    brandTitle: 'Custom - Storybook',
    ...themes.dark,
  },
  panelPosition: 'bottom',
  selectedPanel: 'storybook/roundtrip',
});
