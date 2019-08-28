import { Configuration } from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');

export function webpack(config: Configuration): Configuration {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.ts', '.js'],
      modules: [...config.resolve.modules, 'src', 'node_modules']
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        { test: /\.css$/i, use: ["style-loader", "css-loader"] },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        { test: /\.html$/i, use: '@aurelia/webpack-loader', exclude: /node_modules/ }
      ]
    },
    plugins: [...config.plugins, new HtmlWebpackPlugin({ template: 'index.ejs' })]
  }
}
