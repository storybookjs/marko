import React from 'react';

import NotificationItem from './item';

export default {
  component: NotificationItem,
  title: 'UI/Notifications/Item',
  decorators: [(storyFn) => <div style={{ width: '240px', margin: '1rem' }}>{storyFn()}</div>],
  excludeStories: /.*Data$/,
};

const onClear = () => {};

export const simpleData = {
  id: '1',
  onClear,
  content: {
    headline: '🎉 Storybook is cool!',
  },
};

export const longHeadlineData = {
  id: '2',
  onClear,
  content: {
    headline: '🎉 This is a long message that extends over two lines!',
  },
};

export const linkData = {
  id: '3',
  onClear,
  content: {
    headline: '🎉 Storybook X.X is available! Download now »',
  },
  link: '/some/path',
};

export const BookIconData = {
  id: '4',
  onClear,
  content: {
    headline: '🎉 Storybook has a book icon!',
  },
  showBookIcon: true,
};

export const BookIconSubHeadlineData = {
  id: '5',
  onClear,
  content: {
    headline: '🎉 Storybook has a book icon!',
    subHeadline: 'Find out more!',
  },
  showBookIcon: true,
};

export const BookIconSubHeadlineIsLongData = {
  id: '6',
  onClear,
  content: {
    headline: '🎉 Storybook has a book icon!',
    subHeadline:
      'Find out more! by clicking on on buttons and downloading some applications. Find out more! by clicking on on buttons and downloading some applications',
  },
  showBookIcon: true,
};
export const simple = () => <NotificationItem notification={simpleData} />;

export const longText = () => <NotificationItem notification={longHeadlineData} />;

export const withLink = () => <NotificationItem notification={linkData} />;

export const withBookIcon = () => <NotificationItem notification={BookIconData} />;

export const withBookIconSubHeadline = () => (
  <NotificationItem notification={BookIconSubHeadlineData} />
);

export const withBookIconSubHeadlineIsLong = () => (
  <NotificationItem notification={BookIconSubHeadlineIsLongData} />
);
