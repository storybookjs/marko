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
  core: {
    builder: 'webpack4',
  },
};
