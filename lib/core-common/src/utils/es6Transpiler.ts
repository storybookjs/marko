import { RuleSetRule } from 'webpack';
import { babelConfig } from './babel';

const { plugins } = babelConfig();

const nodeModulesThatNeedToBeParsedBecauseTheyExposeES6 = [
  '@storybook/node_logger',
  'node_modules/json5',
  'node_modules/semver',
  'node_modules/highlight.js',
];

export const es6Transpiler: () => RuleSetRule = () => {
  // TODO: generate regexp using are-you-es5

  const include = (input: string) => {
    return (
      !!nodeModulesThatNeedToBeParsedBecauseTheyExposeES6.find((p) => input.includes(p)) ||
      !!input.match(
        /[\\/]node_modules[\\/](@storybook\/node-logger|are-you-es5|better-opn|boxen|chalk|commander|find-cache-dir|find-up|fs-extra|json5|node-fetch|pkg-dir|prettier|resolve-from|semver|highlight.js)/
      )
    );
  };
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
              {
                shippedProposals: true,
                modules: false,
                targets: 'defaults',
              },
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
