import React, { FunctionComponent, SyntheticEvent } from 'react';
import { Tabs, IconButton, Icons } from '@storybook/components';
import { useStorybookApi } from '@storybook/api';
import { Location, Route } from '@storybook/router';
import { styled } from '@storybook/theming';
import { AboutPage } from './about_page';
import { ReleaseNotesPage } from './release_notes_page';
import { ShortcutsPage } from './shortcuts_page';

const ABOUT = 'about';
const SHORTCUTS = 'shortcuts';
const RELEASE_NOTES = 'release-notes';

export const Wrapper = styled.div`
  div[role='tabpanel'] {
    height: 100%;
  }
`;

interface PureSettingsPagesProps {
  activeTab: string;
  changeTab: (tab: string) => {};
  onClose: () => {};
}

const PureSettingsPages: FunctionComponent<PureSettingsPagesProps> = ({
  activeTab,
  changeTab,
  onClose,
}) => (
  <Wrapper>
    <Tabs
      absolute
      selected={activeTab}
      actions={{ onSelect: changeTab }}
      tools={
        <IconButton
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            return onClose();
          }}
        >
          <Icons icon="close" />
        </IconButton>
      }
    >
      <div id={ABOUT} title="About">
        <Route path={ABOUT}>
          <AboutPage key={ABOUT} onClose={onClose} />
        </Route>
      </div>

      <div id={RELEASE_NOTES} title="Release notes">
        <Route path={RELEASE_NOTES}>
          <ReleaseNotesPage key={RELEASE_NOTES} onClose={onClose} />
        </Route>
      </div>

      <div id={SHORTCUTS} title="Keyboard shortcuts">
        <Route path={SHORTCUTS}>
          <ShortcutsPage key={SHORTCUTS} onClose={onClose} />
        </Route>
      </div>
    </Tabs>
  </Wrapper>
);

const SettingsPages: FunctionComponent = () => {
  const api = useStorybookApi();
  const changeTab = (tab: string) => api.changeSettingsTab(tab);

  return (
    <Location key="location.consumer">
      {(locationData) => (
        <PureSettingsPages
          activeTab={locationData.storyId}
          changeTab={changeTab}
          onClose={api.closeSettings}
        />
      )}
    </Location>
  );
};

export { SettingsPages as default };
