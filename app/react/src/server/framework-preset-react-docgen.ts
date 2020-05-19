import type { TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import type { StorybookOptions } from '@storybook/core/types';

export function babel(config: TransformOptions, { typescriptOptions }: StorybookOptions) {
  const { reactDocgen } = typescriptOptions;
  if (!reactDocgen) {
    return config;
  }
  return {
    ...config,
    overrides: [
      {
        test: reactDocgen === 'react-docgen' ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
        plugins: [
          [
            require.resolve('babel-plugin-react-docgen'),
            {
              DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
            },
          ],
        ],
      },
    ],
  };
}

export function webpackFinal(config: Configuration, { typescriptOptions }: StorybookOptions) {
  const { reactDocgen, reactDocgenTypescriptOptions } = typescriptOptions;
  if (reactDocgen !== 'react-docgen-typescript') return config;
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.tsx?$/,
          // include: path.resolve(__dirname, "../src"),
          use: [
            {
              loader: require.resolve('react-docgen-typescript-loader'),
              options: reactDocgenTypescriptOptions,
            },
          ],
        },
      ],
    },
  };
}
