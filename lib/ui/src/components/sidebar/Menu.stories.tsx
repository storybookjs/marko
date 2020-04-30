import React from 'react';

import { TooltipLinkList } from '@storybook/components';
import { MenuItemIcon } from './Menu';

export default {
  component: MenuItemIcon,
  title: 'UI/Sidebar/Menu',
};

export const all = () => (
  <TooltipLinkList
    links={[
      { title: 'has icon', left: <MenuItemIcon icon="check" />, id: 'icon' },
      {
        title: 'has imgSrc',
        left: <MenuItemIcon imgSrc="https://via.placeholder.com/20" />,
        id: 'img',
      },
      { title: 'has neither', left: <MenuItemIcon />, id: 'non' },
    ]}
  />
);
