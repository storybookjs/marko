// eslint-disable-next-line import/no-extraneous-dependencies
import createCompiler from '@storybook/addon-docs/mdx-compiler-plugin';
import path from 'path';
import remarkSlug from 'remark-slug';
import remarkExternalLinks from 'remark-external-links';

import { DllReferencePlugin } from 'webpack';

const coreDirName = path.dirname(require.resolve('@storybook/core/package.json'));
const context = path.join(coreDirName, '../../node_modules');

function createBabelOptions(babelOptions?: any, configureJSX?: boolean) {
  if (!configureJSX) {
    return babelOptions;
  }

  const babelPlugins = (babelOptions && babelOptions.plugins) || [];
  return {
    ...babelOptions,
    // for frameworks that are not working with react, we need to configure
    // the jsx to transpile mdx, for now there will be a flag for that
    // for more complex solutions we can find alone that we need to add '@babel/plugin-transform-react-jsx'
    plugins: [...babelPlugins, '@babel/plugin-transform-react-jsx'],
  };
}

export const webpackDlls = (dlls: string[], options: any) => {
  return options.dll ? [...dlls, './sb_dll/storybook_docs_dll.js'] : [];
};

export function webpack(webpackConfig: any = {}, options: any = {}) {
  const { module = {} } = webpackConfig;
  // it will reuse babel options that are already in use in storybook
  // also, these babel options are chained with other presets.
  const {
    babelOptions,
    configureJSX = options.framework !== 'react', // if not user-specified
    sourceLoaderOptions = {},
  } = options;

  const mdxLoaderOptions = {
    remarkPlugins: [remarkSlug, remarkExternalLinks],
  };

  // set `sourceLoaderOptions` to `null` to disable for manual configuration
  const sourceLoader = sourceLoaderOptions
    ? [
        {
          test: /\.(stories|story)\.[tj]sx?$/,
          loader: require.resolve('@storybook/source-loader'),
          options: { ...sourceLoaderOptions, inspectLocalDependencies: true },
          enforce: 'pre',
        },
      ]
    : [];

  const result = {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: /\.js$/,
          include: new RegExp(`node_modules\\${path.sep}acorn-jsx`),
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [[require.resolve('@babel/preset-env'), { modules: 'commonjs' }]],
              },
            },
          ],
        },
        {
          test: /\.(stories|story).mdx$/,
          use: [
            {
              loader: 'babel-loader',
              options: createBabelOptions(babelOptions, configureJSX),
            },
            {
              loader: '@mdx-js/loader',
              options: {
                compilers: [createCompiler(options)],
                ...mdxLoaderOptions,
              },
            },
          ],
        },
        {
          test: /\.mdx$/,
          exclude: /\.(stories|story).mdx$/,
          use: [
            {
              loader: 'babel-loader',
              options: createBabelOptions(babelOptions, configureJSX),
            },
            {
              loader: '@mdx-js/loader',
              options: mdxLoaderOptions,
            },
          ],
        },
        ...sourceLoader,
      ],
    },
  };

  if (options.dll) {
    result.plugins.push(
      new DllReferencePlugin({
        context,
        manifest: path.join(coreDirName, 'dll', 'storybook_docs-manifest.json'),
      })
    );
  }

  return result;
}

export function managerEntries(entry: any[] = [], options: any) {
  return [...entry, require.resolve('../../register')];
}

export function config(entry: any[] = [], options: any = {}) {
  const { framework } = options;
  const docsConfig = [require.resolve('./config')];
  try {
    docsConfig.push(require.resolve(`../${framework}/config`));
  } catch (err) {
    // there is no custom config for the user's framework, do nothing
  }
  return [...docsConfig, ...entry];
}
