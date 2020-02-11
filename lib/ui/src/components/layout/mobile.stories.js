import React, { Fragment } from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { ActiveTabs } from '@storybook/api';

import { Mobile } from './mobile';

import { mockProps, realProps, MockPage } from './app.mockdata';

export default {
  title: 'UI/Layout/Mobile',
  component: Mobile,
  decorators: [
    withKnobs,
    StoryFn => {
      const mocked = boolean('mock', true);

      const props = {
        ...(mocked ? mockProps : realProps),
      };

      return <StoryFn props={props} />;
    },
  ],
};

export const InitialSidebar = ({ props }) => (
  <Mobile {...props} options={{ initialActive: ActiveTabs.SIDEBAR }} />
);
export const InitialCanvas = ({ props }) => (
  <Mobile {...props} options={{ initialActive: ActiveTabs.CANVAS }} />
);
export const InitialAddons = ({ props }) => (
  <Mobile {...props} options={{ initialActive: ActiveTabs.ADDONS }} />
);
export const Page = ({ props }) => (
  <Mobile
    {...props}
    options={{ initialActive: ActiveTabs.CANVAS }}
    pages={[
      {
        key: 'settings',
        // eslint-disable-next-line react/prop-types
        route: ({ children }) => <Fragment>{children}</Fragment>,
        render: () => <MockPage />,
      },
    ]}
    viewMode="settings"
  />
);
