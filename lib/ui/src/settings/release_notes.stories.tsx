import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';

import { DecoratorFn } from '@storybook/react';
import { PureReleaseNotes } from './release_notes';

export default {
  component: PureReleaseNotes,
  title: 'UI/Settings/ReleaseNotes',
};

const actions = makeActions('setLoaded');

const VERSION = '6.0.0';

export const Loading = () => (
  <PureReleaseNotes didHitMaxWaitTime={false} isLoaded={false} version={VERSION} {...actions} />
);

export const DidHitMaxWaitTime = () => (
  <PureReleaseNotes didHitMaxWaitTime isLoaded={false} version={VERSION} {...actions} />
);
