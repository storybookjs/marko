import React, { FunctionComponent } from 'react';
import { State } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/router';
import ItemContent from './itemContent';
import DismissNotificationItem from './itemDismiss';

const Notification = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  padding: '13px 15px',
  width: '280px',
  borderRadius: 4,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
  background:
    theme.base === 'light'
      ? 'rgba(50,53,71,0.97)'
      : 'linear-gradient(0deg, rgba(248,248,248,0.97) 0%, rgba(247,252,255,0.97) 100%)',
  boxShadow: `0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)`,
  color: theme.color.inverseText,
  textDecoration: 'none',
  '&:hover': {
    boxShadow:
      '0 1px 3px 0 rgba(30,167,253,0.5), 0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)',
  },
  '&:active': {
    boxShadow:
      '0 1px 3px 0 rgba(30,167,253,0.5), 0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)',
  },
  '&:focus': {
    boxShadow:
      '0 1px 3px 0 rgba(30,167,253,0.5), 0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)',
  },
}));

const NotificationLink = Notification.withComponent(Link);

export const NotificationItemSpacer = styled.div({
  height: 48,
});

const NotificationItem: FunctionComponent<{
  notification: State['notifications'][0];
  setDismissedNotification: (id: string) => void;
}> = ({
  notification: { content, link, onClear, id, showBookIcon = false },
  setDismissedNotification,
}) => {
  const dismissNotificationItem = () => {
    setDismissedNotification(id);
    onClear();
  };
  return link ? (
    <NotificationLink to={link}>
      <ItemContent showBookIcon={showBookIcon} content={content} />
      <DismissNotificationItem onClick={dismissNotificationItem} />
    </NotificationLink>
  ) : (
    <Notification>
      <ItemContent showBookIcon={showBookIcon} content={content} />
      <DismissNotificationItem onClick={dismissNotificationItem} />
    </Notification>
  );
};

export default NotificationItem;
