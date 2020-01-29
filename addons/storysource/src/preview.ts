import { logger } from '@storybook/client-logger';

export function withStorySource(source: string, locationsMap = {}) {
  logger.error(
    '@storybook/addon-storysource/withStorySource is deprecated, please use paramaters instead.'
  );

  return (storyFn: (context: any) => React.ReactNode, context: any) => {
    return storyFn(context);
  };
}
