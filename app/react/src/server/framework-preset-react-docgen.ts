import { TransformOptions } from '@babel/core';
import { Configuration } from 'webpack';
import type { StorybookOptions } from '@storybook/core/types';

const DEFAULT_DOCGEN = 'react-docgen-typescript';

const getDocgen = (typescriptOptions: StorybookOptions['typescriptOptions']) => {
  const docgen = typescriptOptions?.reactDocgen;
  return typeof docgen === 'undefined' ? DEFAULT_DOCGEN : docgen;
};

export function babel(
  config: TransformOptions,
  { typescriptOptions }: StorybookOptions = { typescriptOptions: {} }
) {
  const reactDocgen = getDocgen(typescriptOptions);
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

export function webpackFinal(
  config: Configuration,
  { typescriptOptions }: StorybookOptions = { typescriptOptions: {} }
) {
  const reactDocgen = getDocgen(typescriptOptions);
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
              options: typescriptOptions?.reactDocgenTypescriptOptions,
            },
          ],
        },
      ],
    },
  };
}
