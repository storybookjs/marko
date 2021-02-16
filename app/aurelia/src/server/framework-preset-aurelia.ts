import { Configuration, WebpackPluginInstance } from 'webpack';
import createForkTsCheckerInstance from './create-fork-ts-checker-plugin';
import getTsLoaderOptions from './ts_config';

export function webpack(
  config: Configuration,
  { configDir }: { configDir: string }
): Configuration {
  config.module.rules.push(
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      use: require.resolve('url-loader') as string,
      options: {
        limit: 10000,
      },
    },
    {
      test: /\.css$/i,
      issuer: [{ not: [/\.html$/i] }],
      use: [require.resolve('style-loader') as string, require.resolve('css-loader') as string],
    },
    {
      test: /\.css$/i,
      issuer: [/\.html$/i],
      // CSS required in templates cannot be extracted safely
      // because Aurelia would try to require it again in runtime
      use: require.resolve('css-loader') as string,
    },
    {
      test: /\.scss$/,
      use: [
        require.resolve('style-loader') as string,
        require.resolve('css-loader') as string,
        require.resolve('sass-loader') as string,
      ],
      issuer: /\.[tj]s$/i,
    },
    {
      test: /\.scss$/,
      use: [require.resolve('css-loader') as string, require.resolve('sass-loader') as string],
      issuer: /\.html?$/i,
    },
    {
      test: /\.ts$/i,
      use: [
        require.resolve('ts-loader') as string,
        require.resolve('@aurelia/webpack-loader') as string,
      ],
      exclude: /node_modules/,
    },
    {
      test: /\.html$/i,
      use: require.resolve('@aurelia/webpack-loader') as string,
      exclude: /node_modules/,
    }
  );

  config.resolve.extensions.push('.ts', '.js');

  config.plugins.push(
    (createForkTsCheckerInstance(getTsLoaderOptions(configDir)) as any) as WebpackPluginInstance
  );

  return config;
}
