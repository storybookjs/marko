import { Configuration } from 'webpack'; // eslint-disable-line
import type { StorybookOptions } from '@storybook/core/types';

export async function webpack(config: Configuration, options: StorybookOptions) {
  const { preprocess = undefined, loader = {} } = await options.presets.apply(
    'svelteOptions',
    {},
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
