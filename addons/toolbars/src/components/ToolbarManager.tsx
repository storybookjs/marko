import React, { FC } from 'react';
import { useParameter } from '@storybook/api';
import { Separator } from '@storybook/components';

import { Toolbars, ToolbarConfig } from '../types';
import { MenuToolbar } from './MenuToolbar';

const normalize = (config: ToolbarConfig) => ({
  ...config,
  items: config.items.map(item => (typeof item === 'string' ? { value: item, title: item } : item)),
});

/**
 * A smart component for handling manager-preview interactions.
 */
export const ToolbarManager: FC = () => {
  const toolbars = useParameter<Toolbars>('toolbars', {});
  const keys = Object.keys(toolbars);
  if (!keys.length) return null;

  return (
    <>
      <Separator />
      {keys.map(key => {
        const normalizedConfig = normalize(toolbars[key]);
        return <MenuToolbar key={key} id={key} {...normalizedConfig} />;
      })}
    </>
  );
};
