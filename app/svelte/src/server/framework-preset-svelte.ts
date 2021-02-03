import { Configuration } from 'webpack'; // eslint-disable-line

export function webpack(config: Configuration) {
  config.module.rules.push({
    test: /\.(svelte|html)$/,
    loader: require.resolve('svelte-loader') as string,
    options: {},
  });

  config.resolve.extensions.push('.svelte');

  return config;
}
