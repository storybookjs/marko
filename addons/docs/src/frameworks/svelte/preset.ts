import path from 'path';

export function webpackFinal(webpackConfig: any = {}, options: any = {}) {
  webpackConfig.module.rules.push({
    test: /\.svelte$/,
    loader: path.resolve('./svelte-docgen-loader'),
    enforce: 'pre',
  });
  return webpackConfig;
}
