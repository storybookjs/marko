export const plugins = [
  require.resolve('@babel/plugin-transform-shorthand-properties'),
  require.resolve('@babel/plugin-transform-block-scoping'),
  [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
  require.resolve('@babel/plugin-proposal-export-default-from'),
  require.resolve('@babel/plugin-syntax-dynamic-import'),
  [
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    { loose: true, useBuiltIns: true },
  ],
  require.resolve('@babel/plugin-transform-classes'),
  require.resolve('@babel/plugin-transform-arrow-functions'),
  require.resolve('@babel/plugin-transform-parameters'),
  require.resolve('@babel/plugin-transform-destructuring'),
  require.resolve('@babel/plugin-transform-spread'),
  require.resolve('@babel/plugin-transform-for-of'),
  require.resolve('babel-plugin-macros'),
];

export const presets = [
  [
    require.resolve('@babel/preset-env'),
    { shippedProposals: true, useBuiltIns: 'usage', corejs: '3' },
  ],
  require.resolve('@babel/preset-typescript'),
];

export default () => {
  return {
    sourceType: 'unambiguous',
    presets: [...presets],
    plugins: [
      ...plugins,
      [require.resolve('babel-plugin-emotion'), { sourceMap: true, autoLabel: true }],
    ],
  };
};
