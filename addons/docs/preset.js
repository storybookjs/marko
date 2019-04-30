const createCompiler = require('./mdx-compiler-plugin');

function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  // it will reuse babel options that are already in use in storybook
  // also, these babel options are chained with other presets.
  const { babelOptions } = options;

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
              options: babelOptions,
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
