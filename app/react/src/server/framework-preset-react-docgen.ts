import { TransformOptions } from '@babel/core';
import { Configuration } from 'webpack';

export function babel(
  config: TransformOptions,
  { typescript: { docgen = 'react-docgen-typescript' } = {} } = {}
) {
  return {
    ...config,
    overrides: [
      {
        test: docgen === 'react-docgen' ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
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

export function webpackFinal(config: Configuration, { typescript } = { typescript: {} }) {
  // @ts-ignore
  const docgen = typescript?.docgen || 'react-docgen-typescript';
  if (docgen !== 'react-docgen-typescript') return config;
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    },
  };
}
