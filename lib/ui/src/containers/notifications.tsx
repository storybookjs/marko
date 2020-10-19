import React, { FunctionComponent } from 'react';

import { Consumer, Combo } from '@storybook/api';

import NotificationList from '../components/notifications/NotificationList';

export const mapper = ({ state }: Combo) => {
  const { notifications } = state;

  return {
    notifications,
  };
};

const NotificationConnect: FunctionComponent<any> = (props) => (
  <Consumer filter={mapper}>
    {(fromState) => <NotificationList {...props} {...fromState} />}
  </Consumer>
);

export default NotificationConnect;
