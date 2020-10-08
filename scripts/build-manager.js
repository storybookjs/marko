const { buildStaticStandalone } = require('../lib/core/dist/server/build-static');

const options = {
  managerOnly: true,
  outputDir: './lib/core/prebuilt',
  configDir: './scripts/build-manager-config',
};

process.env.NODE_ENV = 'production';

buildStaticStandalone(options);
