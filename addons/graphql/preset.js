const { join } = require('path');
const { ContextReplacementPlugin } = require('webpack');

const managerWebpack = async (config) => {
  // See https://github.com/graphql/graphql-language-service/issues/111#issuecomment-306723400

  config.plugins.push(
    new ContextReplacementPlugin(/graphql-language-service-interface[/\\]dist/, /\.js$/)
  );

  config.module.rules.push({
    test: /\.js$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          sourceType: 'unambiguous',
          plugins: [[require.resolve('@babel/plugin-transform-classes'), { loose: true }]],
        },
      },
    ],
    include: new RegExp(join('node_modules', 'graphql-')),
  });

  return config;
};

module.exports = { managerWebpack };
