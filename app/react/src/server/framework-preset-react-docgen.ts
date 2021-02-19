import type { TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import ReactDocgenTypescriptPlugin from 'react-docgen-typescript-plugin';
import type { Options, TypescriptConfig } from '@storybook/core-common';

export async function babel(config: TransformOptions, { presets }: Options) {
  const typescriptOptions = await presets.apply<TypescriptConfig>('typescript', {} as any);

  const { reactDocgen } = typescriptOptions;

  if (typeof reactDocgen !== 'string') {
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

export async function webpackFinal(config: Configuration, { presets }: Options) {
  const typescriptOptions = await presets.apply<TypescriptConfig>('typescript', {} as any);

  const { reactDocgen, reactDocgenTypescriptOptions } = typescriptOptions;

  if (reactDocgen !== 'react-docgen-typescript') {
    return config;
  }

  return {
    ...config,
    plugins: [
      ...config.plugins,
      new ReactDocgenTypescriptPlugin({
        ...reactDocgenTypescriptOptions,
        // We *need* this set so that RDT returns default values in the same format as react-docgen
        savePropValueAsString: true,
      }),
    ],
  };
}
