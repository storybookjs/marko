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
    headline: 'Storybook is cool!',
  },
};

export const longHeadlineData = {
  id: '2',
  onClear,
  content: {
    headline: 'This is a long message that extends over two lines!',
  },
};

export const linkData = {
  id: '3',
  onClear,
  content: {
    headline: 'Storybook X.X is available! Download now »',
  },
  link: '/some/path',
};

export const BookIconData = {
  id: '4',
  onClear,
  content: {
    headline: 'Storybook has a book icon!',
  },
  icon: {
    name: 'book',
  },
};

export const BookIconSubHeadlineData = {
  id: '5',
  onClear,
  content: {
    headline: 'Storybook has a book icon!',
    subHeadline: 'Find out more!',
  },
  icon: {
    name: 'book',
  },
};

export const BookIconSubHeadlineIsLongData = {
  id: '6',
  onClear,
  content: {
    headline: 'Storybook has a book icon!',
    subHeadline:
      'Find out more! by clicking on on buttons and downloading some applications. Find out more! by clicking   on buttons and downloading some applications',
  },
  icon: {
    name: 'book',
  },
};

export const AccessibilityIconGold = {
  id: '7',
  onClear,
  content: {
    headline: 'Storybook has a accessibility icon!',
    subHeadline: 'It is gold!',
  },
  icon: {
    name: 'accessibility',
    color: 'gold',
  },
};

export const AccessibilityIconGoldNoSubHeadline = {
  id: '8',
  onClear,
  content: {
    headline: 'Storybook has a accessibility icon!',
  },
  icon: {
    name: 'accessibility',
    color: 'gold',
  },
};
export const simple = () => <NotificationItem notification={simpleData} />;

export const longText = () => <NotificationItem notification={longHeadlineData} />;

export const withLink = () => <NotificationItem notification={linkData} />;

export const withBookIcon = () => <NotificationItem notification={BookIconData} />;

export const withBookIconSubHeadline = () => (
  <NotificationItem notification={BookIconSubHeadlineData} />
);

export const withBookIconSubHeadlineIsLong = () => (
  <NotificationItem notification={AccessibilityIconGoldNoSubHeadline} />
);

export const withAccessibilityIconGold = () => (
  <NotificationItem notification={AccessibilityIconGold} />
);

export const withAccessibilityIconGoldNoSubHeadline = () => (
  <NotificationItem notification={AccessibilityIconGoldNoSubHeadline} />
);
