import webpackConfig from '../preview/iframe-webpack.config';
import { createPreviewEntry } from '../preview/entries';

export const webpack = async (_: unknown, options: any) => webpackConfig(options);

export const entries = async (_: unknown, options: any) => {
  let result: string[] = [];

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
