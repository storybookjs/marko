const { buildStaticStandalone } = require('../lib/core/dist/server/build-static');

process.env.NODE_ENV = 'production';

buildStaticStandalone({
  managerOnly: true,
  outputDir: './lib/core/prebuilt',
  configDir: './scripts/build-manager-config',
});
