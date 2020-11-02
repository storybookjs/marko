import path from 'path';
import remarkSlug from 'remark-slug';
import remarkExternalLinks from 'remark-external-links';

// @ts-ignore
import createCompiler from '../../mdx/mdx-compiler-plugin';

// for frameworks that are not working with react, we need to configure
// the jsx to transpile mdx, for now there will be a flag for that
// for more complex solutions we can find alone that we need to add '@babel/plugin-transform-react-jsx'
type BabelParams = {
  babelOptions?: any;
  mdxBabelOptions?: any;
  configureJSX?: boolean;
};
function createBabelOptions({ babelOptions, mdxBabelOptions, configureJSX }: BabelParams) {
  const babelPlugins = mdxBabelOptions?.plugins || babelOptions?.plugins || [];
  const jsxPlugin = [
    require.resolve('@babel/plugin-transform-react-jsx'),
    { pragma: 'React.createElement', pragmaFrag: 'React.Fragment' },
  ];
  const plugins = configureJSX ? [...babelPlugins, jsxPlugin] : babelPlugins;
  return {
    // don't use the root babelrc by default (users can override this in mdxBabelOptions)
    babelrc: false,
    configFile: false,
    ...babelOptions,
    ...mdxBabelOptions,
    plugins,
  };
}

export function webpack(webpackConfig: any = {}, options: any = {}) {
  const { module = {} } = webpackConfig;
  // it will reuse babel options that are already in use in storybook
  // also, these babel options are chained with other presets.
  const {
    babelOptions,
    mdxBabelOptions,
    configureJSX = true,
    sourceLoaderOptions = { injectStoryParameters: true },
    transcludeMarkdown = false,
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

  let rules = module.rules || [];
  if (transcludeMarkdown) {
    rules = [
      ...rules.filter((rule: any) => rule.test.toString() !== '/\\.md$/'),
      {
        test: /\.md$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: createBabelOptions({ babelOptions, mdxBabelOptions, configureJSX }),
          },
          {
            loader: require.resolve('@mdx-js/loader'),
            options: mdxLoaderOptions,
          },
        ],
      },
    ];
  }

  const result = {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...rules,
        {
          test: /\.js$/,
          include: new RegExp(`node_modules\\${path.sep}acorn-jsx`),
          use: [
            {
              loader: require.resolve('babel-loader'),
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
              loader: require.resolve('babel-loader'),
              options: createBabelOptions({ babelOptions, mdxBabelOptions, configureJSX }),
            },
            {
              loader: require.resolve('@mdx-js/loader'),
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
              loader: require.resolve('babel-loader'),
              options: createBabelOptions({ babelOptions, mdxBabelOptions, configureJSX }),
            },
            {
              loader: require.resolve('@mdx-js/loader'),
              options: mdxLoaderOptions,
            },
          ],
        },
        ...sourceLoader,
      ],
    },
  };

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
