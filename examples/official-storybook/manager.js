import React from 'react';
import { addons } from '@storybook/addons';
import { themes, styled } from '@storybook/theming';
import { Icons } from '@storybook/components';

import addHeadWarning from './head-warning';

addHeadWarning('manager-head-not-loaded', 'Manager head not loaded');

const PrefixIcon = styled(Icons)(({ theme }) => ({
  marginRight: 8,
  fontSize: 'inherit',
  height: '1em',
  width: '1em',
  display: 'inline',
  alignSelf: 'center',
}));

addons.setConfig({
  theme: themes.light, // { base: 'dark', brandTitle: 'Storybook!' },
  previewTabs: {
    canvas: null,
    'storybook/docs/panel': null,
    'storybookjs/notes/panel': { title: 'Annotations', hidden: true },
    graphiql: {
      hidden: true,
    },
  },
  storyPrefix: {
    addons: <PrefixIcon icon="power" />,
    'addons-a11y': <PrefixIcon icon="certificate" />,
    'addons-a11y-basebutton': <PrefixIcon icon="calendar" />,
    'addons-a11y-basebutton--default': <PrefixIcon icon="star" />,
  },
});
