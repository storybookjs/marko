import React from 'react';

import { Provider as ManagerProvider } from '@storybook/api';
import { Location, LocationProvider } from '@storybook/router';
import { ThemeProvider, ensure as ensureTheme, themes } from '@storybook/theming';

import { Preview } from './preview';

import { PrettyFakeProvider } from '../../FakeProvider';
import { previewProps } from './preview.mockdata';

const provider = new PrettyFakeProvider();

export default {
  title: 'UI/Preview/Preview',
  component: Preview,
  decorators: [
    StoryFn => (
      <LocationProvider key="location.provider">
        <Location key="location.consumer">
          {locationData => (
            <ManagerProvider key="manager" provider={provider} {...locationData} docsMode={false}>
              <ThemeProvider key="theme.provider" theme={ensureTheme(themes.light)}>
                <StoryFn />
              </ThemeProvider>
            </ManagerProvider>
          )}
        </Location>
      </LocationProvider>
    ),
  ],
};

export const noTabs = () => <Preview {...previewProps} getElements={() => []} />;

export const withTabs = () => <Preview {...previewProps} />;
