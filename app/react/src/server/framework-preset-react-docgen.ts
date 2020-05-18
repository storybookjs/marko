import { TransformOptions } from '@babel/core';
import { Configuration } from 'webpack';

type Docgen = 'react-docgen' | 'react-docgen-typescript';
interface TypescriptOptions {
  typescriptOptions?: { docgen?: Docgen };
}
const DEFAULT_DOCGEN = 'react-docgen-typescript';

export function babel(
  config: TransformOptions,
  { typescriptOptions }: TypescriptOptions = { typescriptOptions: {} }
) {
  const docgen = typescriptOptions?.docgen || DEFAULT_DOCGEN;
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

export function webpackFinal(
  config: Configuration,
  { typescriptOptions }: TypescriptOptions = { typescriptOptions: {} }
) {
  const docgen = typescriptOptions?.docgen || DEFAULT_DOCGEN;
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
