import autoprefixer from 'autoprefixer';
import findUp from 'find-up';
import path from 'path';
import { logger } from '@storybook/node-logger';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import type { BuilderOptions, LoadedPreset, Options } from '@storybook/core-common';

const warnImplicitPostcssPlugins = deprecate(
  () => ({
    // Additional config is merged with config, so we have it disabled currently
    config: false,
    plugins: [
      require('postcss-flexbugs-fixes'), // eslint-disable-line global-require
      autoprefixer({
        flexbox: 'no-2009',
      }),
    ],
  }),
  dedent`
    Default PostCSS plugins are deprecated. When switching to '@storybook/addon-postcss',
    you will need to add your own plugins, such as 'postcss-flexbugs-fixes' and 'autoprefixer'.

    See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-default-postcss-plugins for details.
  `
);

const warnGetPostcssOptions = deprecate(
  () => {},
  dedent`
    Relying on the implicit PostCSS loader is deprecated and will be removed in Storybook 7.0.
    If you need PostCSS, include '@storybook/addon-postcss' in your '.storybook/main.js' file.

    See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-implicit-postcss-loader for details.
    `
);

const getPostcssOptions = async () => {
  const postcssConfigFiles = [
    '.postcssrc',
    '.postcssrc.json',
    '.postcssrc.yml',
    '.postcssrc.js',
    'postcss.config.js',
  ];
  // This is done naturally by newer postcss-loader (through cosmiconfig)
  const customPostcssConfig = await findUp(postcssConfigFiles);

  if (customPostcssConfig) {
    logger.info(`=> Using custom ${path.basename(customPostcssConfig)}`);
    warnGetPostcssOptions();
    return {
      config: customPostcssConfig,
    };
  }
  return warnImplicitPostcssPlugins();
};

const presetName = (preset: LoadedPreset | string): string =>
  typeof preset === 'string' ? preset : preset.name;

export async function createDefaultWebpackConfig(storybookBaseConfig: any, options: Options) {
  if (
    options.presetsList.some((preset) =>
      /@storybook(\/|\\)preset-create-react-app/.test(presetName(preset))
    )
  ) {
    return storybookBaseConfig;
  }

  const hasPostcssAddon = options.presetsList.some((preset) =>
    /@storybook(\/|\\)addon-postcss/.test(presetName(preset))
  );

  const features = await options.presets.apply<{ postcss?: boolean }>('features');

  let cssLoaders = {};
  if (!hasPostcssAddon) {
    logger.info(`=> Using implicit CSS loaders`);
    const use = [
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

      features?.postcss !== false
        ? {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: await getPostcssOptions(),
            },
          }
        : null,
    ];
    cssLoaders = {
      test: /\.css$/,
      sideEffects: true,
      use: use.filter(Boolean),
    };
  }

  const isProd = storybookBaseConfig.mode !== 'development';

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
            esModule: false,
            name: isProd
              ? 'static/media/[name].[contenthash:8].[ext]'
              : 'static/media/[path][name].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: isProd
              ? 'static/media/[name].[contenthash:8].[ext]'
              : 'static/media/[path][name].[ext]',
          },
        },
      ],
    },
  };
}
