import { TransformOptions } from '@babel/core';

export function babelDefault(config: TransformOptions) {
  return {
    ...config,
    presets: [
      ...config.presets,
      [
        require.resolve('babel-preset-rax'),
        { development: process.env.BABEL_ENV === 'development' },
      ],
    ],
  };
}
