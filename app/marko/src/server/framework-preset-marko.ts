import type { Configuration } from 'webpack';

export function webpack(config: Configuration): Configuration {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.marko$/,
          loader: require.resolve('@marko/webpack/loader'),
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.marko'],
    },
  };
}
