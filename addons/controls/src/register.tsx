import React from 'react';
import addons, { types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { API } from '@storybook/api';
import { ControlsPanel } from './components/ControlsPanel';
import { ID } from './constants';

addons.register(ID, (api: API) => {
  addons.addPanel(ID, {
    title: 'Controls',
    type: types.PANEL,
    render: ({ active }) => {
      if (!active || !api.getCurrentStoryData()) {
        return null;
      }
      return (
        <AddonPanel active={active}>
          <ControlsPanel />
        </AddonPanel>
      );
    },
  });
});
