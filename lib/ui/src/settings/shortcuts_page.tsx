import React, { FunctionComponent } from 'react';

import { Consumer } from '@storybook/api';

import { ShortcutsScreen } from './shortcuts';

const ShortcutsPage: FunctionComponent<{}> = () => (
  <Consumer>
    {({
      api: { getShortcutKeys, setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts },
    }) => (
      <ShortcutsScreen
        shortcutKeys={getShortcutKeys()}
        {...{ setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts }}
      />
    )}
  </Consumer>
);

export { ShortcutsPage };
