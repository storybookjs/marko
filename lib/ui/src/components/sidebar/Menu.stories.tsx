import React, { Fragment } from 'react';

import { WithTooltip, TooltipLinkList, Icons } from '@storybook/components';
import { MenuItemIcon, SidebarMenu, MenuButton, SidebarMenuList } from './Menu';
import { useMenu } from '../../containers/menu';

export default {
  component: MenuItemIcon,
  title: 'UI/Sidebar/Menu',
  decorators: [
    (StoryFn) => (
      <Fragment>
        <StoryFn />
      </Fragment>
    ),
  ],
};

export const Items = () => (
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

export const Real = () => <SidebarMenu menu={[]} isHighlighted />;

export const Expanded = () => {
  const menu = useMenu(
    { getShortcutKeys: () => ({}), versionUpdateAvailable: () => false },
    false,
    false,
    false,
    false
  );
  return (
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnClick
      startOpen
      tooltip={({ onHide }) => <SidebarMenuList onHide={onHide} menu={menu} />}
    >
      <MenuButton outline small containsIcon highlighted={false} title="Shortcuts">
        <Icons icon="ellipsis" />
      </MenuButton>
    </WithTooltip>
  );
};
