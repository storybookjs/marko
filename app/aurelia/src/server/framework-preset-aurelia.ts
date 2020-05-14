import { Configuration } from 'webpack';
import createForkTsCheckerInstance from './create-fork-ts-checker-plugin';
import getTsLoaderOptions from './ts_config';

export function webpack(
  config: Configuration,
  { configDir }: { configDir: string }
): Configuration {
  const tsLoaderOptions = getTsLoaderOptions(configDir);
  return {
    ...config,
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.ts', '.js'],
      modules: [...config.resolve.modules, 'src', 'node_modules'],
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
        {
          test: /\.css$/i,
          issuer: [{ not: [{ test: /\.html$/i }] }],
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.css$/i,
          issuer: [{ test: /\.html$/i }],
          // CSS required in templates cannot be extracted safely
          // because Aurelia would try to require it again in runtime
          use: 'css-loader',
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          issuer: /\.[tj]s$/i,
        },
        {
          test: /\.scss$/,
          use: ['css-loader', 'sass-loader'],
          issuer: /\.html?$/i,
        },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        { test: /\.html$/i, use: '@aurelia/webpack-loader', exclude: /node_modules/ },
      ],
    },
    plugins: [...config.plugins, createForkTsCheckerInstance(tsLoaderOptions)],
  };
}
