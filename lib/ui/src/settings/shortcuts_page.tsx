import { history } from 'global';
import React from 'react';

import { Consumer } from '@storybook/api';

import ShortcutsScreen from './shortcuts';

export default () => (
  <Consumer>
    {({
      api: { getShortcutKeys, setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts },
    }) => (
      <ShortcutsScreen
        shortcutKeys={getShortcutKeys()}
        {...{ setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts }}
        onClose={() => history.back()}
      />
    )}
  </Consumer>
);
