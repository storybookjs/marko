import type { StorybookOptions as BaseOptions } from '@storybook/core/types';

export interface StorybookOptions extends BaseOptions {
  reactOptions?: {
    fastRefresh?: boolean;
  };
}
