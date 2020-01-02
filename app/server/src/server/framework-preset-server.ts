// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration } from 'webpack';
import path from 'path';

export function webpack(config: Configuration) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          type: 'javascript/auto',
          test: /\.stories\.json$/,
          use: [
            {
              loader: path.resolve(__dirname, './loader.js'),
            },
          ],
        },
      ],
    },
  };
}
