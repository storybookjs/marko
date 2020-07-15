import React, { FC } from 'react';
import { useGlobalTypes } from '@storybook/api';
import { Separator } from '@storybook/components';

import { ToolbarArgType } from '../types';
import { MenuToolbar } from './MenuToolbar';

const normalize = (key: string, argType: ToolbarArgType) => ({
  ...argType,
  name: argType.name || key,
  description: argType.description || key,
  toolbar: {
    ...argType.toolbar,
    items: argType.toolbar.items.map((item) =>
      typeof item === 'string' ? { value: item, title: item } : item
    ),
  },
});

/**
 * A smart component for handling manager-preview interactions.
 */
export const ToolbarManager: FC = () => {
  const globalTypes = useGlobalTypes();
  const keys = Object.keys(globalTypes).filter((key) => !!globalTypes[key].toolbar);
  if (!keys.length) return null;

  return (
    <>
      <Separator />
      {keys.map((key) => {
        const normalizedConfig = normalize(key, globalTypes[key] as ToolbarArgType);
        return <MenuToolbar key={key} id={key} {...normalizedConfig} />;
      })}
    </>
  );
};
