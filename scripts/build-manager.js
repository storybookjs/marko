const { buildStaticStandalone } = require('../lib/core-server/dist/cjs/build-static');

process.env.NODE_ENV = 'production';

buildStaticStandalone({
  ignorePreview: true,
  outputDir: './lib/core-server/prebuilt',
  configDir: './scripts/build-manager-config',
});
