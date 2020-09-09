import React, { FunctionComponent } from 'react';
import memoize from 'memoizerific';
import { Consumer, Combo } from '@storybook/api';

import AddonPanel from '../components/panel/panel';

const createPanelActions = memoize(1)((api) => ({
  onSelect: (panel: string) => api.setSelectedPanel(panel),
  toggleVisibility: () => api.togglePanel(),
  togglePosition: () => api.togglePanelPosition(),
}));

const mapper = ({ state, api }: Combo) => ({
  panels: api.getStoryPanels(),
  selectedPanel: api.getSelectedPanel(),
  panelPosition: state.layout.panelPosition,
  actions: createPanelActions(api),
  shortcuts: api.getShortcutKeys(),
});

const Panel: FunctionComponent<any> = (props) => (
  <Consumer filter={mapper}>{(customProps) => <AddonPanel {...props} {...customProps} />}</Consumer>
);

export default Panel;
