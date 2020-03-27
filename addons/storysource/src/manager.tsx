import React from 'react';
import addons from '@storybook/addons';

import { StoryPanel } from './StoryPanel';
import { ADDON_ID, PANEL_ID } from '.';

export function register() {
  addons.register(ADDON_ID, (api) => {
    addons.addPanel(PANEL_ID, {
      title: 'Story',
      render: ({ active, key }) => (active ? <StoryPanel key={key} api={api} /> : null),
      paramKey: 'storysource',
    });
  });
}
