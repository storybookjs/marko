import autoprefixer from 'autoprefixer';
import findUp from 'find-up';
import path from 'path';
import { logger } from '@storybook/node-logger';

// TODO(blaine): Deprecate this for the addon-postcss
// Deprecating this will be a good way to cover all of the implicit usage of postcss-loader
async function getPostcssOptions() {
  const postcssConfigFiles = [
    '.postcssrc',
    '.postcssrc.json',
    '.postcssrc.yml',
    '.postcssrc.js',
    'postcss.config.js',
  ];
  const customPostcssConfig = await findUp(postcssConfigFiles);

  if (customPostcssConfig) {
    // TODO(blaine): Deprecate this and utilize the natural config lookup in postcss-loader
    logger.info(`=> Using custom ${path.basename(customPostcssConfig)}`);
    return {
      config: customPostcssConfig,
    };
  }
  return {
    // Additional config is merged with config, so we have it disabled currently
    // TODO(blaine): Utilize the natural config lookup in postcss-loader
    config: false,
    plugins: () => [
      require('postcss-flexbugs-fixes'), // eslint-disable-line global-require
      autoprefixer({
        flexbox: 'no-2009',
      }),
    ],
  };
}

export async function createDefaultWebpackConfig(
  storybookBaseConfig: any,
  options: { presetsList: any[] }
) {
  if (
    options.presetsList.some((preset) =>
      /@storybook(\/|\\)preset-create-react-app/.test(preset.name || preset)
    )
  ) {
    return storybookBaseConfig;
  }

  // This pattern covers @storybook/addons-postcss and
  // /storybook/addons/postcss (for local development)
  const hasPostcssAddon = options.presetsList.some((preset) =>
    /@storybook(\/|\\)addon-postcss/.test(preset.name || preset)
  );

  let cssLoaders = {};
  if (!hasPostcssAddon) {
    logger.info(`=> Using implicit CSS loaders`);
    cssLoaders = {
      test: /\.css$/,
      sideEffects: true,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            postcssOptions: await getPostcssOptions(),
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
            esModule: false,
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          query: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
  };
}
