import path from 'path';
import { serverRequire } from './interpret-require';

const webpackConfigs = ['webpack.config', 'webpackfile'];

export default (configDir: string) =>
  serverRequire(webpackConfigs.map((configName) => path.resolve(configDir, configName)));
