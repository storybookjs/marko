// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration } from 'webpack';
import type { Options } from '@storybook/core-common';

export async function webpack(config: Configuration, options: Options): Promise<Configuration> {
  const { preprocess = undefined, loader = {} } = await options.presets.apply(
    'svelteOptions',
    {} as any,
    options
  );

  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(svelte|html)$/,
          loader: require.resolve('svelte-loader'),
          options: { preprocess, ...loader },
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.svelte'],
      alias: config.resolve.alias,
    },
  };
}
