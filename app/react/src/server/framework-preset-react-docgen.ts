import type { TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import ReactDocgenTypescriptPlugin from 'react-docgen-typescript-plugin';
import type { StorybookOptions } from './types';

export function babel(config: TransformOptions, { typescriptOptions }: StorybookOptions) {
  const { reactDocgen } = typescriptOptions;

  if (reactDocgen === false) {
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

  if (reactDocgen !== 'react-docgen-typescript') {
    return config;
  }

  return {
    ...config,
    plugins: [...config.plugins, new ReactDocgenTypescriptPlugin(reactDocgenTypescriptOptions)],
  };
}
