import { includePaths, excludePaths } from '../config/utils';
import { plugins } from '../common/babel';

export default () => ({
  test: /\.(mjs|tsx?|jsx?)$/,
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
          require.resolve('@babel/preset-typescript'),
          require.resolve('@babel/preset-react'),
        ],
        plugins,
      },
    },
  ],
  include: [...includePaths, /node_modules/],
  exclude: [...excludePaths, /dist/],
});
