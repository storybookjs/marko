import { includePaths, excludePaths } from '../config/utils';
import { plugins } from '../common/babel';
import { useBaseTsSupport } from '../config/useBaseTsSupport';

export const createBabelLoader = (options, framework) => ({
  test: useBaseTsSupport(framework) ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
  use: [
    {
      loader: 'babel-loader',
      options,
    },
  ],
  include: includePaths,
  exclude: excludePaths,
});

export const es6ModulesRule = {
  test: /\.js$/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        sourceType: 'unambiguous',
        presets: [
          [
            require.resolve('@babel/preset-env'),
            { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' },
          ],
        ],
        plugins,
      },
    },
  ],
  include: [/node_modules/],
  exclude: excludePaths,
};
