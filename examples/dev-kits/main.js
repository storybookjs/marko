module.exports = {
  stories: ['./stories/*.*'],
  refs: {
    ember: 'https://5e32a5d4977061000ca89459--storybookjs.netlify.com/ember-cli',
    cra: 'https://5e32a5d4977061000ca89459--storybookjs.netlify.com/cra-ts-kitchen-sink',
  },
  webpack: async config => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(ts|tsx)$/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [['react-app', { flow: false, typescript: true }]],
          },
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
    },
  }),
  managerWebpack: async config => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /manager\.js$/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [['react-app', { flow: false, typescript: true }]],
          },
        },
      ],
    },
  }),
};
