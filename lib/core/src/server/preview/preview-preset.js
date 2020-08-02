import webpackConfig from './iframe-webpack.config';
import { createPreviewEntry } from './entries';

export const webpack = async (_, options) => webpackConfig(options);

export const entries = async (_, options) => {
  let result = [];

  result = result.concat(await createPreviewEntry(options));

  if (options.configType === 'DEVELOPMENT') {
    // Suppress informational messages when --quiet is specified. webpack-hot-middleware's quiet
    // parameter would also suppress warnings.
    result = result.concat(
      `${require.resolve('webpack-hot-middleware/client')}?reload=true&quiet=false&noInfo=${
        options.quiet
      }`
    );
  }

  return result;
};

export * from '../common/common-preset';
