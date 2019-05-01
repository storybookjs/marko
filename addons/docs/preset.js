const createCompiler = require('./mdx-compiler-plugin');

function createBableOptions({ babelOptions, configureReactForMdx }) {
  if (!configureReactForMdx) {
    return babelOptions;
  }

  return {
    ...babelOptions,
    // for frameworks that are not working with react, we need to configure
    // the jsx to transpile mdx, for now there will be a flag for that
    // for more complex solutions we can find alone that we need to add '@babel/plugin-transform-react-jsx'
    plugins: [...babelOptions.plugins, '@babel/plugin-transform-react-jsx'],
  };
}

function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  // it will reuse babel options that are already in use in storybook
  // also, these babel options are chained with other presets.
  const { babelOptions, configureReactForMdx } = options;

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: /\.mdx$/,
          use: [
            {
              loader: 'babel-loader',
              options: createBableOptions({ babelOptions, configureReactForMdx }),
            },
            {
              loader: '@mdx-js/loader',
              options: {
                compilers: [createCompiler(options)],
              },
            },
          ],
        },
      ],
    },
  };
}

function addons(entry = []) {
  return [...entry, require.resolve('./register')];
}

module.exports = { webpack, addons };
