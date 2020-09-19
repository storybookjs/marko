import { StorybookConfig as BaseConfig } from '@storybook/core/types';

export interface StorybookConfig extends BaseConfig {
  reactOptions?: {
    fastRefresh?: boolean;
  };
}
