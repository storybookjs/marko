import { plugins } from './babel';

const es6Transpiler = () => {
  // TODO: generate regexp using are-you-es5

  const include = /[\\/]node_modules[\\/](@storybook\/node-logger|are-you-es5|better-opn|boxen|chalk|commander|find-cache-dir|find-up|fs-extra|json5|node-fetch|pkg-dir|resolve-from|semver)/;
  return {
    test: /\.js$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          sourceType: 'unambiguous',
          presets: [
            [
              require.resolve('@babel/preset-env'),
              { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' },
            ],
            require.resolve('@babel/preset-react'),
          ],
          plugins,
        },
      },
    ],
    include,
  };
};

export default es6Transpiler;
