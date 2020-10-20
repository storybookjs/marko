import React, { FunctionComponent } from 'react';
import { State } from '@storybook/api';
import { styled, CSSObject } from '@storybook/theming';
import NotificationItem from './NotificationItem';

const List = styled.div<{ placement?: CSSObject }>(
  {
    zIndex: 10,

    '> * + *': {
      marginTop: 10,
    },
    '&:empty': {
      display: 'none',
    },
  },
  ({ placement }) =>
    placement || {
      bottom: 0,
      left: 0,
      right: 0,
      position: 'fixed',
    }
);

const NotificationList: FunctionComponent<{
  placement: CSSObject;
  notifications: State['notifications'];
  clearNotification: (id: string) => void;
}> = ({ notifications, clearNotification, placement = undefined }) => (
  <List placement={placement}>
    {notifications.map((notification) => (
      <NotificationItem
        key={notification.id}
        onDismissNotification={(id: string) => clearNotification(id)}
        notification={notification}
      />
    ))}
  </List>
);

export default NotificationList;
