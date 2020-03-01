import { IconsProps } from '@storybook/components';

export interface ToolbarItem {
  value: string;
  icon?: IconsProps['icon'];
  left?: string;
  right?: string;
  title?: string;
}

export interface NormalizedToolbarConfig {
  name: string;
  icon?: IconsProps['icon'];
  description: string;
  defaultValue?: any;
  items: ToolbarItem[];
}

export type ToolbarConfig = NormalizedToolbarConfig & {
  items: string[] | ToolbarItem[];
};

export type Toolbars = Record<string, ToolbarConfig>;
