import { includePaths } from '../config/utils';
import { useBaseTsSupport } from '../config/useBaseTsSupport';

export const createBabelLoader = (options, framework) => ({
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
