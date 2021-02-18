import path from 'path';

import { Configuration } from 'webpack';
import type { StorybookOptions } from '@storybook/core/types';

export async function webpackFinal(webpackConfig: Configuration, options: StorybookOptions) {
  const svelteOptions = await options.presets.apply('svelteOptions', {}, options);

  webpackConfig.module.rules.push({
    test: /\.svelte$/,
    loader: path.resolve(`${__dirname}/svelte-docgen-loader`),
    enforce: 'post',
    options: svelteOptions,
  });

  return webpackConfig;
}
