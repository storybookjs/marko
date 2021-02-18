import path from 'path';
import fse from 'fs-extra';
import { DefinePlugin, HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import VirtualModulePlugin from 'webpack-virtual-modules';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// @ts-ignore
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';

import themingPaths from '@storybook/theming/paths';

import { createBabelLoader } from './babel-loader-preview';
import { es6Transpiler } from '../common/es6Transpiler';

import { nodeModulesPaths, loadEnv } from '../config/utils';
import { getPreviewHeadHtml, getPreviewBodyHtml } from '../utils/template';
import { toRequireContextString } from './to-require-context';
import { useBaseTsSupport } from '../config/useBaseTsSupport';

const storybookPaths: Record<string, string> = [
  'addons',
  'api',
  'channels',
  'channel-postmessage',
  'components',
  'core-events',
  'router',
  'theming',
  'semver',
  'client-api',
  'client-logger',
].reduce(
  (acc, sbPackage) => ({
    ...acc,
    [`@storybook/${sbPackage}`]: path.dirname(
      require.resolve(`@storybook/${sbPackage}/package.json`)
    ),
  }),
  {}
);

export default async ({
  configDir,
  babelOptions,
  entries,
  stories,
  outputDir = path.join('.', 'public'),
  quiet,
  packageJson,
  configType,
  framework,
  frameworkPath,
  presets,
  typescriptOptions,
}: any) => {
  const logLevel = await presets.apply('logLevel', undefined);
  const frameworkOptions = await presets.apply(`${framework}Options`, {});
  const headHtmlSnippet = await presets.apply(
    'previewHead',
    getPreviewHeadHtml(configDir, process.env)
  );
  const bodyHtmlSnippet = await presets.apply(
    'previewBody',
    getPreviewBodyHtml(configDir, process.env)
  );
  const { raw, stringified } = loadEnv({ production: true });
  const babelLoader = createBabelLoader(babelOptions, framework);
  const isProd = configType === 'PRODUCTION';
  const entryTemplate = await fse.readFile(path.join(__dirname, 'virtualModuleEntry.template.js'), {
    encoding: 'utf8',
  });
  const storyTemplate = await fse.readFile(path.join(__dirname, 'virtualModuleStory.template.js'), {
    encoding: 'utf8',
  });
  const frameworkInitEntry = path.resolve(
    path.join(configDir, 'storybook-init-framework-entry.js')
  );
  // Allows for custom frameworks that are not published under the @storybook namespace
  const frameworkImportPath = frameworkPath || `@storybook/${framework}`;
  const virtualModuleMapping = {
    // Ensure that the client API is initialized by the framework before any other iframe code
    // is loaded. That way our client-apis can assume the existence of the API+store
    [frameworkInitEntry]: `import '${frameworkImportPath}';`,
  };
  entries.forEach((entryFilename: any) => {
    const match = entryFilename.match(/(.*)-generated-(config|other)-entry.js$/);
    if (match) {
      const configFilename = match[1];
      const clientApi = storybookPaths['@storybook/client-api'];
      const clientLogger = storybookPaths['@storybook/client-logger'];

      virtualModuleMapping[entryFilename] = interpolate(entryTemplate, {
        configFilename,
        clientApi,
        clientLogger,
      });
    }
  });
  if (stories) {
    const storiesFilename = path.resolve(path.join(configDir, `generated-stories-entry.js`));
    virtualModuleMapping[storiesFilename] = interpolate(storyTemplate, { frameworkImportPath })
      // Make sure we also replace quotes for this one
      .replace("'{{stories}}'", stories.map(toRequireContextString).join(','));
  }

  const shouldCheckTs = useBaseTsSupport(framework) && typescriptOptions.check;
  const tsCheckOptions = typescriptOptions.checkOptions || {};

  return {
    name: 'preview',
    mode: isProd ? 'production' : 'development',
    bail: isProd,
    devtool: '#cheap-module-source-map',
    entry: entries,
    output: {
      path: path.resolve(process.cwd(), outputDir),
      filename: '[name].[hash].bundle.js',
      publicPath: '',
    },
    plugins: [
      new FilterWarningsPlugin({
        exclude: /export '\S+' was not found in 'global'/,
      }),
      Object.keys(virtualModuleMapping).length > 0
        ? new VirtualModulePlugin(virtualModuleMapping)
        : null,
      new HtmlWebpackPlugin({
        filename: `iframe.html`,
        // FIXME: `none` isn't a known option
        chunksSortMode: 'none' as any,
        alwaysWriteToDisk: true,
        inject: false,
        templateParameters: (compilation, files, options) => ({
          compilation,
          files,
          options,
          version: packageJson.version,
          globals: {
            LOGLEVEL: logLevel,
            FRAMEWORK_OPTIONS: frameworkOptions,
          },
          headHtmlSnippet,
          bodyHtmlSnippet,
        }),
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        template: require.resolve(`../templates/index.ejs`),
      }),
      new DefinePlugin({
        'process.env': stringified,
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      isProd ? null : new WatchMissingNodeModulesPlugin(nodeModulesPaths),
      isProd ? null : new HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      quiet ? null : new ProgressPlugin(),
      new Dotenv({ silent: true }),
      shouldCheckTs ? new ForkTsCheckerWebpackPlugin(tsCheckOptions) : null,
    ].filter(Boolean),
    module: {
      rules: [
        babelLoader,
        es6Transpiler(),
        {
          test: /\.md$/,
          use: [
            {
              loader: require.resolve('raw-loader'),
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.cjs'],
      modules: ['node_modules'].concat((raw.NODE_PATH as string[]) || []),
      mainFields: isProd ? undefined : ['browser', 'main'],
      alias: {
        ...themingPaths,
        ...storybookPaths,
        react: path.dirname(require.resolve('react/package.json')),
        'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      },

      plugins: [
        // Transparently resolve packages via PnP when needed; noop otherwise
        PnpWebpackPlugin,
      ],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
      sideEffects: true,
      usedExports: true,
      concatenateModules: true,
      minimizer: isProd
        ? [
            new TerserWebpackPlugin({
              cache: true,
              parallel: true,
              sourceMap: true,
              terserOptions: {
                mangle: false,
                keep_fnames: true,
              },
              // FIXME: `cache` isn't a known attribute
            } as any),
          ]
        : [],
    },
    performance: {
      hints: isProd ? 'warning' : false,
    },
  };
};

/**
 * Return a string corresponding to template filled with bindings using following pattern:
 * For each (key, value) of `bindings` replace, in template, `{{key}}` by escaped version of `value`
 *
 * @param template {String} Template with `{{binding}}`
 * @param bindings {Object} key-value object use to fill the template, `{{key}}` will be replaced by `escaped(value)`
 * @returns {String} Filled template
 */
const interpolate = (template: string, bindings: Record<string, string>) => {
  return Object.entries(bindings).reduce((acc, [k, v]) => {
    const escapedString = v.replace(/\\/g, '/').replace(/\$/g, '$$$');
    return acc.replace(new RegExp(`{{${k}}}`, 'g'), escapedString);
  }, template);
};
