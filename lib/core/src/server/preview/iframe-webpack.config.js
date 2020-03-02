import path from 'path';
import { DefinePlugin, HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CoreJSUpgradeWebpackPlugin from 'corejs-upgrade-webpack-plugin';
import VirtualModulePlugin from 'webpack-virtual-modules';
import PnpWebpackPlugin from 'pnp-webpack-plugin';

import resolveFrom from 'resolve-from';

import createBabelLoader from './babel-loader-preview';

import { nodeModulesPaths, loadEnv } from '../config/utils';
import { getPreviewHeadHtml, getPreviewBodyHtml } from '../utils/template';
import { toRequireContextString } from './to-require-context';

const reactPaths = {};
try {
  reactPaths.react = path.dirname(resolveFrom(process.cwd(), 'react/package.json'));
  reactPaths['react-dom'] = path.dirname(resolveFrom(process.cwd(), 'react-dom/package.json'));
} catch (e) {
  //
}

export default ({
  configDir,
  babelOptions,
  entries,
  stories,
  outputDir = path.join('.', 'public'),
  quiet,
  packageJson,
  configType,
  framework,
}) => {
  const { raw, stringified } = loadEnv({ production: true });
  const babelLoader = createBabelLoader(babelOptions);
  const isProd = configType === 'PRODUCTION';

  const frameworkInitEntry = path.resolve(
    path.join(configDir, 'storybook-init-framework-entry.js')
  );
  const virtualModuleMapping = {
    // Ensure that the client API is initialized by the framework before any other iframe code
    // is loaded. That way our client-apis can assume the existence of the API+store
    [frameworkInitEntry]: `import '@storybook/${framework}';`,
  };
  entries.forEach(entryFilename => {
    const match = entryFilename.match(/(.*)-generated-config-entry.js$/);
    if (match) {
      const configFilename = match[1];
      virtualModuleMapping[entryFilename] = `
        import { addDecorator, addParameters } from '@storybook/client-api';

        const { decorators, parameters } = require(${JSON.stringify(configFilename)});
        
        if (decorators) decorators.forEach(decorator => addDecorator(decorator));
        if (parameters) addParameters(parameters);
      `;
    }
  });
  if (stories) {
    virtualModuleMapping[path.resolve(path.join(configDir, `generated-stories-entry.js`))] = `
      import { configure } from '@storybook/${framework}';
      module._StorybookPreserveDecorators = true;

      configure([${stories.map(toRequireContextString).join(',')}
      ], module);
    `;
  }

  return {
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
      Object.keys(virtualModuleMapping).length > 0
        ? new VirtualModulePlugin(virtualModuleMapping)
        : null,
      new HtmlWebpackPlugin({
        filename: `iframe.html`,
        chunksSortMode: 'none',
        alwaysWriteToDisk: true,
        inject: false,
        templateParameters: (compilation, files, options) => ({
          compilation,
          files,
          options,
          version: packageJson.version,
          globals: {},
          headHtmlSnippet: getPreviewHeadHtml(configDir, process.env),
          dlls: [],
          bodyHtmlSnippet: getPreviewBodyHtml(configDir, process.env),
        }),
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
      new CoreJSUpgradeWebpackPlugin({ resolveFrom: __dirname }),
    ].filter(Boolean),
    module: {
      rules: [
        babelLoader,
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
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      modules: ['node_modules'].concat(raw.NODE_PATH || []),
      alias: {
        'babel-runtime/core-js/object/assign': require.resolve('core-js/es/object/assign'),
        ...reactPaths,
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
      minimizer: [
        new TerserWebpackPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            mangle: false,
            keep_fnames: true,
          },
        }),
      ],
    },
    performance: {
      hints: isProd ? 'warning' : false,
    },
  };
};
