export function withStorySource(source: string, locationsMap = {}) {
  // eslint-disable-next-line no-console
  console.error(
    '@storybook/addon-storysource/withStorySource is deprecated, please use paramaters instead.'
  );

  return (storyFn: (context: any) => React.ReactNode, context: any) => {
    return storyFn(context);
  };
}
