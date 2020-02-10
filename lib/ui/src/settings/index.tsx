import React, { FunctionComponent, Fragment } from 'react';
import AboutPage from './about_page';
import ShortcutsPage from './shortcuts_page';

const SettingsPages: FunctionComponent = () => (
  <Fragment>
    <AboutPage key="about" />, <ShortcutsPage key="shortcuts" />
  </Fragment>
);

export { SettingsPages as default };
