import webpackConfig from './iframe-webpack.config';
import { createPreviewEntry } from './entries';

export const webpack = async (_, options) => webpackConfig(options);

export const entries = async (_, options) => {
  let result = [];

  result = result.concat(await createPreviewEntry(options));

  if (options.configType === 'DEVELOPMENT') {
    result = result.concat(
      `${require.resolve('webpack-hot-middleware/client')}?reload=true&quiet=false`
    );
  }

  return result;
};

export * from '../common/common-preset';
