import path from 'path';
import { ProgressPlugin, DllPlugin } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CoreJSUpgradeWebpackPlugin from 'corejs-upgrade-webpack-plugin';

const resolveLocal = (dir) => path.join(__dirname, dir);

const r = resolveLocal('../../../node_modules');
const out = resolveLocal('../../core/dll');

export default ({ entry, provided = [] }) => ({
  name: 'storybook_ui',
  mode: 'development',

  entry,
  output: {
    path: out,
    filename: 'storybook_ui_dll.js',
    library: 'storybook_ui_dll',
  },
  externals: provided,

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              sourceType: 'unambiguous',
              plugins: [
                require.resolve('@babel/plugin-transform-shorthand-properties'),
                require.resolve('@babel/plugin-proposal-object-rest-spread'),
                require.resolve('@babel/plugin-transform-template-literals'),
                require.resolve('@babel/plugin-transform-block-scoping'),
                require.resolve('@babel/plugin-transform-classes'),
                require.resolve('@babel/plugin-transform-arrow-functions'),
                require.resolve('@babel/plugin-transform-parameters'),
                require.resolve('@babel/plugin-transform-destructuring'),
                require.resolve('@babel/plugin-transform-spread'),
                require.resolve('@babel/plugin-transform-for-of'),
              ],
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    modules: [path.join(__dirname, '../../../node_modules')],
  },

  plugins: [
    new ProgressPlugin(),
    new DllPlugin({
      context: r,
      path: `${out}/storybook_ui-manifest.json`,
      name: 'storybook_ui_dll',
    }),
    new CoreJSUpgradeWebpackPlugin(),
  ],
  optimization: {
    concatenateModules: true,
    portableRecords: true,
    moduleIds: 'hashed',
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: (file) => file.replace('.js', '.LICENCE'),
          banner: (licenseFile) => `License information can be found in ${licenseFile}`,
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
});
