import { includePaths } from '../config/utils';

export default () => ({
  test: /\.(mjs|jsx?)$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' }],
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
        plugins: [
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          '@babel/plugin-proposal-export-default-from',
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
          'babel-plugin-macros',
        ],
      },
    },
  ],
  include: includePaths,
  exclude: /node_module|dist/,
});
