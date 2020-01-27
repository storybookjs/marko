import merge from 'babel-merge';
import { includePaths, excludePaths } from '../config/utils';

export default options => ({
  test: /\.(mjs|jsx?)$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        ...options,
        ...merge(options, {
          presets: [
            ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' }],
            '@babel/preset-typescript',
            '@babel/preset-react',
          ],
          plugins: [
            [
              '@babel/plugin-proposal-decorators',
              {
                legacy: true,
              },
            ],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
            'babel-plugin-macros',
            ['emotion', { sourceMap: true, autoLabel: true }],
          ],
        }),
      },
    },
  ],
  include: includePaths,
  exclude: excludePaths,
});
