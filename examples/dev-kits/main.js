module.exports = {
  stories: ['./stories/*.*'],
  refs: {
    ember: {
      id: 'ember',
      title: 'Ember',
      url: 'https://deploy-preview-9210--storybookjs.netlify.app/ember-cli',
    },
    cra: 'https://deploy-preview-9210--storybookjs.netlify.app/cra-ts-kitchen-sink',
  },
  webpack: async (config) => ({
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
  managerWebpack: async (config) => ({
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
