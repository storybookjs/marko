const createCompiler = require('./mdx-compiler-plugin');

function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: /\.mdx$/,
          use: [
            { loader: 'babel-loader' },
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
