// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration } from 'webpack';
import path from 'path';

export function webpack(config: Configuration) {
  config.module.rules.push({
    type: 'javascript/auto',
    test: /\.stories\.json$/,
    use: path.resolve(__dirname, './loader.js'),
  });

  return config;
}
