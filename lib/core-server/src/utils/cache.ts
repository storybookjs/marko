import Cache from 'file-system-cache';
import { resolvePathInStorybookCache } from '@storybook/core-common';

export const cache = Cache({
  basePath: resolvePathInStorybookCache('dev-server'),
  ns: 'storybook', // Optional. A grouping namespace for items.
});
