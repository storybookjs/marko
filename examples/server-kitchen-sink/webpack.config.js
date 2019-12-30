const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/storybook.js',
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: 'storybook.js',
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'client/storybook.html'),
      fileName: path.join(__dirname, 'build/storybook.html'),
    }),
  ],
};
