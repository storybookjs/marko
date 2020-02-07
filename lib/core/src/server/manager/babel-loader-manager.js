import { includePaths } from '../config/utils';

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
        plugins: [
          [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
          require.resolve('@babel/plugin-proposal-export-default-from'),
          require.resolve('@babel/plugin-syntax-dynamic-import'),
          [
            require.resolve('@babel/plugin-proposal-object-rest-spread'),
            { loose: true, useBuiltIns: true },
          ],
          require.resolve('babel-plugin-macros'),
        ],
      },
    },
  ],
  include: includePaths,
  exclude: [/node_module/, /dist/],
});
