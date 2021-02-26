import { logger } from '@storybook/node-logger';
import type { Options } from '@storybook/core-common';
import type { Configuration } from 'webpack';

export async function createDefaultWebpackConfig(
  storybookBaseConfig: Configuration,
  options: Options
): Promise<Configuration> {
  if (
    options.presetsList.some((preset) =>
      /@storybook(\/|\\)preset-create-react-app/.test(
        typeof preset === 'string' ? preset : preset.name
      )
    )
  ) {
    return storybookBaseConfig;
  }

  const hasPostcssAddon = options.presetsList.some((preset) =>
    /@storybook(\/|\\)addon-postcss/.test(typeof preset === 'string' ? preset : preset.name)
  );

  let cssLoaders = {};
  if (!hasPostcssAddon) {
    logger.info(`=> Using implicit CSS loaders`);
    cssLoaders = {
      test: /\.css$/,
      sideEffects: true,
      use: [
        // TODO(blaine): Decide if we want to keep style-loader & css-loader in core
        // Trying to apply style-loader or css-loader to files that already have been
        // processed by them causes webpack to crash, so no one else can add similar
        // loader configurations to the `.css` extension.
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
          },
        },
      ],
    };
  }

  return {
    ...storybookBaseConfig,
    module: {
      ...storybookBaseConfig.module,
      rules: [
        ...storybookBaseConfig.module.rules,
        cssLoaders,
        {
          test: /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
  };
}
