import React, { FC } from 'react';
import { useGlobalArgs } from '@storybook/api';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { NormalizedToolbarConfig } from '../types';

export type MenuToolbarProps = NormalizedToolbarConfig & { id: string };

export const MenuToolbar: FC<MenuToolbarProps> = ({ id, name, description, icon, items }) => {
  const [globalArgs, updateGlobalArgs] = useGlobalArgs();
  const selectedValue = globalArgs[id];
  const active = selectedValue != null;
  const selectedItem = active && items.find(item => item.value === selectedValue);

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }) => {
        const links = items.map(item => {
          const { value, left, title, right } = item;
          return {
            id: value,
            left,
            title,
            right,
            active: selectedValue === value,
            onClick: () => {
              updateGlobalArgs({ [id]: value });
              onHide();
            },
          };
        });
        return <TooltipLinkList links={links} />;
      }}
      closeOnClick
    >
      <IconButton key={name} active={active} title={description}>
        <Icons icon={(selectedItem && selectedItem.icon) || icon} />
      </IconButton>
    </WithTooltip>
  );
};
