const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.stories\.js$/,
    use: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: { injectParameters: true },
      },
    ],
    include: [path.resolve(__dirname, '../src')],
    enforce: 'pre',
  });
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
      },
      {
        loader: require.resolve('react-docgen-typescript-loader'),
      },
    ],
    include: [path.resolve(__dirname, '../src')],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
