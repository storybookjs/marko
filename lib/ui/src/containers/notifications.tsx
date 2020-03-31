import React, { FunctionComponent } from 'react';

import { Consumer, Combo } from '@storybook/api';

import Notifications from '../components/notifications/notifications';

export const mapper = ({ state }: Combo) => {
  const { notifications } = state;

  return {
    notifications,
  };
};

const NotificationConnect: FunctionComponent<any> = (props) => (
  <Consumer filter={mapper}>{(fromState) => <Notifications {...props} {...fromState} />}</Consumer>
);

export default NotificationConnect;
