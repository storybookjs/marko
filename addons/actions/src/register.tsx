import React from 'react';
import { addons, types } from '@storybook/addons';
import ActionLogger from './containers/ActionLogger';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, (api) => {
  addons.addPanel(PANEL_ID, {
    title: 'Actions',
    type: types.PANEL,
    render: ({ active, key }) => <ActionLogger key={key} api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
