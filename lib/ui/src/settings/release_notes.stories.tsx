import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';

import { PureReleaseNotesScreen } from './release_notes';

export default {
  component: PureReleaseNotesScreen,
  title: 'UI/Settings/ReleaseNotes',
};

const actions = makeActions('setLoaded', 'onClose');

const VERSION = '6.0.0';

export const Loading = () => (
  <PureReleaseNotesScreen
    didHitMaxWaitTime={false}
    isLoaded={false}
    version={VERSION}
    {...actions}
  />
);

export const DidHitMaxWaitTime = () => (
  <PureReleaseNotesScreen didHitMaxWaitTime isLoaded={false} version={VERSION} {...actions} />
);
