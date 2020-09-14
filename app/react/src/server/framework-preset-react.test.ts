import * as preset from './framework-preset-react';
import type { StorybookOptions } from './types';

describe('framework-preset-react', () => {
  const babelLoderPath = require.resolve('babel-loader');
  const reactRefreshPath = require.resolve('react-refresh/babel');

  it('should return the config with the extra plugin when fast refresh enabled', () => {
    const config = preset.webpackFinal({}, {
      reactOptions: { fastRefresh: true },
    } as StorybookOptions);

    expect(config.module.rules).toEqual([
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: babelLoderPath,
            options: {
              plugins: [reactRefreshPath],
            },
          },
        ],
      },
    ]);
  });
});
