import React, { FunctionComponent, SyntheticEvent } from 'react';
import { State } from '@storybook/api';
import { styled, lighten, darken } from '@storybook/theming';
import { Link } from '@storybook/router';
import { IconButton, Icons } from '@storybook/components';

const Notification = styled.div(({ theme }) => ({
  display: 'block',
  padding: '16px 20px',
  borderRadius: 10,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
  lineHeight: `16px`,
  boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
  color: theme.color.inverseText,
  backgroundColor:
    theme.base === 'light' ? darken(theme.background.app) : lighten(theme.background.app),
  textDecoration: 'none',
}));

const DismissButtonWrapper = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '4px',
  right: '4px',
  height: '15px',
  color: theme.color.inverseText,
}));

const NotificationLink = Notification.withComponent(Link);

const DismissNotificationItem: FunctionComponent<{
  onClick: () => void;
}> = ({ onClick }) => (
  <DismissButtonWrapper
    title="Dismiss notification"
    onClick={(e: SyntheticEvent) => {
      e.preventDefault();
      onClick();
    }}
  >
    <Icons icon="close" />
  </DismissButtonWrapper>
);

export const NotificationItemSpacer = styled.div({
  height: 48,
});

const NotificationItem: FunctionComponent<{
  notification: State['notifications'][0];
  setDismissedNotification: (id: string) => void;
}> = ({ notification: { content, link, onClear, id }, setDismissedNotification }) => {
  const dismissNotificationItem = () => {
    setDismissedNotification(id);
    onClear();
  };

  return link ? (
    <NotificationLink to={link}>
      {content}
      <DismissNotificationItem onClick={dismissNotificationItem} />
    </NotificationLink>
  ) : (
    <Notification>
      {content}
      <DismissNotificationItem onClick={dismissNotificationItem} />
    </Notification>
  );
};

export default NotificationItem;
