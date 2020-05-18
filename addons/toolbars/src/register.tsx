import React from 'react';
import addons, { types } from '@storybook/addons';
import { ToolbarManager } from './components/ToolbarManager';
import { ID } from './constants';

addons.register(ID, (api) =>
  addons.add(ID, {
    title: ID,
    type: types.TOOL,
    match: () => true,
    render: () => <ToolbarManager />,
  })
);
