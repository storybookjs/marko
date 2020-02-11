import React, { Fragment } from 'react';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';

import { isChromatic } from 'storybook-chromatic/isChromatic';

import { Desktop } from './desktop';

import { store } from './persist';
import { mockProps, realProps, MockPage } from './app.mockdata';

export default {
  title: 'UI/Layout/Desktop',
  component: Desktop,
  decorators: [
    withKnobs,
    StoryFn => {
      const mocked = boolean('mock', true);
      const height = number('height', 900);
      const width = number('width', 1200);

      if (isChromatic) {
        store.local.set(`storybook-layout`, {});
      }

      const props = {
        height,
        width,
        ...(mocked ? mockProps : realProps),
      };

      console.log({ props });

      return (
        <div style={{ minHeight: 900, minWidth: 1200 }}>
          <StoryFn props={props} />;
        </div>
      );
    },
  ],
};

export const Default = ({ props }) => <Desktop {...props} />;
export const NoAddons = ({ props }) => <Desktop {...props} panelCount={0} />;
export const NoNav = ({ props }) => (
  <Desktop {...props} options={{ ...props.options, showNav: false }} />
);
export const NoPanel = ({ props }) => (
  <Desktop {...props} options={{ ...props.options, showPanel: false }} />
);
export const BottomPanel = ({ props }) => (
  <Desktop {...props} options={{ ...props.options, panelPosition: 'bottom' }} />
);
export const Fullscreen = ({ props }) => (
  <Desktop {...props} options={{ ...props.options, isFullscreen: true }} />
);
export const NoPanelNoNav = ({ props }) => (
  <Desktop {...props} options={{ ...props.options, showPanel: false, showNav: false }} />
);
export const Page = ({ props }) => (
  <Desktop
    {...props}
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
