import { useBaseTsSupport } from '../config/useBaseTsSupport';
import { getProjectRoot } from '../utils/paths';

export const createBabelLoader = (options: any, framework: string) => ({
  test: useBaseTsSupport(framework) ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options,
    },
  ],
  include: [getProjectRoot()],
  exclude: /node_modules/,
});
