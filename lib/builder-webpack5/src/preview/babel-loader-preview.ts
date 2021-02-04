import { includePaths } from '../config/utils';
import { useBaseTsSupport } from '../config/useBaseTsSupport';

export const createBabelLoader = (options: any, framework: string) => ({
  test: useBaseTsSupport(framework) ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options,
    },
  ],
  include: includePaths,
  exclude: /node_modules/,
});
