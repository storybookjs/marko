import path from 'path';

import { Configuration } from 'webpack';

export function webpackFinal(webpackConfig: Configuration, options: any = {}) {
  webpackConfig.module.rules.push({
    test: /\.svelte$/,
    loader: path.resolve(`${__dirname}/svelte-docgen-loader`),
    enforce: 'pre',
  });

  return webpackConfig;
}
