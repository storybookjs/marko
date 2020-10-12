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
    headline: 'Storybook cool!',
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

export const linkIconWithColorData = {
  id: '4',
  onClear,
  content: {
    headline: 'Storybook with a smile!',
  },
  icon: {
    name: 'facehappy',
    color: 'hotpink',
  },
  link: '/some/path',
};

export const linkIconWithColorSubHeadlineData = {
  id: '5',
  onClear,
  content: {
    headline: 'Storybook X.X is available with a smile! Download now »',
    subHeadline: 'This link also has a sub headline',
  },
  icon: {
    name: 'facehappy',
    color: 'tomato',
  },
  link: '/some/path',
};

export const bookIconData = {
  id: '6',
  onClear,
  content: {
    headline: 'Storybook has a book icon!',
  },
  icon: {
    name: 'book',
  },
};

export const bookIconSubHeadlineData = {
  id: '7',
  onClear,
  content: {
    headline: 'Storybook has a book icon!',
    subHeadline: 'Find out more!',
  },
  icon: {
    name: 'book',
  },
};

export const bookIconSubHeadlineIsLongData = {
  id: '8',
  onClear,
  content: {
    headline: 'Storybook has a book icon!',
    subHeadline:
      'Find out more! by clicking on on buttons and downloading some applications. Find out more! by clicking on buttons and downloading some applications',
  },
  icon: {
    name: 'book',
  },
};

export const accessibilityIconData = {
  id: '9',
  onClear,
  content: {
    headline: 'Storybook has a accessibility icon!',
    subHeadline: 'It is here!',
  },
  icon: {
    name: 'accessibility',
  },
};

export const accessibilityGoldIconData = {
  id: '10',
  onClear,
  content: {
    headline: 'Accessibility icon!',
    subHeadline: 'It is gold!',
  },
  icon: {
    name: 'accessibility',
    color: 'gold',
  },
};

export const accessibilityGoldIconLongHeadNoSubHeadlineData = {
  id: '11',
  onClear,
  content: {
    headline: 'Storybook notifications has a accessibility icon it can be any color!',
  },
  icon: {
    name: 'accessibility',
    color: 'gold',
  },
};

export const simple = () => <NotificationItem notification={simpleData} />;

export const longText = () => <NotificationItem notification={longHeadlineData} />;

export const withLink = () => <NotificationItem notification={linkData} />;

export const withLinkIconWithColor = () => (
  <NotificationItem notification={linkIconWithColorData} />
);

export const withLinkIconWithColorSubHeadline = () => (
  <NotificationItem notification={linkIconWithColorSubHeadlineData} />
);

export const withBookIcon = () => <NotificationItem notification={bookIconData} />;

export const withBookIconSubHeadline = () => (
  <NotificationItem notification={bookIconSubHeadlineData} />
);

export const withBookIconSubHeadlineIsLong = () => (
  <NotificationItem notification={bookIconSubHeadlineIsLongData} />
);

export const withAccessibilityIcon = () => (
  <NotificationItem notification={accessibilityIconData} />
);

export const withAccessibilityGoldIcon = () => (
  <NotificationItem notification={accessibilityGoldIconData} />
);

export const withAccessibilityGoldIconLongHeadNoSubHeadline = () => (
  <NotificationItem notification={accessibilityGoldIconLongHeadNoSubHeadlineData} />
);
