module.exports = {
  stories: ['./stories/*.*'],
  logLevel: 'debug',
  refs: {
    Ember: {
      title: 'Ember',
      url: 'https://next--storybookjs.netlify.app/ember-cli',
      versions: {
        next: 'https://next--storybookjs.netlify.app/ember-cli',
        master: 'https://master--storybookjs.netlify.app/ember-cli',
      },
    },
    cra: 'https://next--storybookjs.netlify.app/cra-ts-kitchen-sink',
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
