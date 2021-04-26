import React from 'react';
import { addons, types } from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import ActionLogger from './containers/ActionLogger';
import { ADDON_ID, EVENT_ID, PANEL_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, (api) => {
  addons.addPanel(PANEL_ID, {
    title() {
      const [actionsCount, setActionsCount] = React.useState(0);
      api.on(EVENT_ID, () => {
        setActionsCount(actionsCount + 1);
      });
      api.on(STORY_CHANGED, () => setActionsCount(0));
      const suffix = actionsCount === 0 ? '' : ` (${actionsCount})`;
      return `Actions${suffix}`;
    },
    type: types.PANEL,
    render: ({ active, key }) => <ActionLogger key={key} api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
