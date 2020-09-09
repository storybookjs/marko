import React from 'react';
import { action } from '@storybook/addon-actions';

import { State } from '@storybook/api';
import Panel from './panel';
import { panels } from '../layout/app.mockdata';

const onSelect = action('onSelect');
const toggleVisibility = action('toggleVisibility');
const togglePosition = action('togglePosition');

const shortcuts = { panelPosition: 'A', togglePanel: 'B' } as State['shortcuts'];

export default {
  title: 'UI/Panel',
  component: Panel,
};

export const Default = () => (
  <Panel
    absolute={false}
    panels={panels}
    actions={{ onSelect, toggleVisibility, togglePosition }}
    selectedPanel="test2"
    shortcuts={shortcuts}
  />
);

export const NoPanels = () => (
  <Panel
    panels={{}}
    actions={{ onSelect, toggleVisibility, togglePosition }}
    shortcuts={shortcuts}
  />
);
