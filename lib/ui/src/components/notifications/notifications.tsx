import React, { FunctionComponent } from 'react';
import { State } from '@storybook/api';
import { styled, CSSObject } from '@storybook/theming';

import NotificationItem from './item';

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
}> = ({ notifications, placement = undefined }) => {
  const [dismissedNotificationsIds, setDismissedNotificationsWithIds] = React.useState<string[]>(
    []
  );

  return (
    <List placement={placement}>
      {notifications.map((notification) =>
        dismissedNotificationsIds.indexOf(notification.id) === -1 ? (
          <NotificationItem
            key={notification.id}
            setDismissedNotification={(id: string) =>
              setDismissedNotificationsWithIds([...dismissedNotificationsIds, ...[id]])
            }
            notification={notification}
          />
        ) : null
      )}
    </List>
  );
};

export default NotificationList;
