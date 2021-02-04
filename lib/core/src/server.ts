/* eslint-disable import/no-dynamic-require, global-require */
// import Cache from 'file-system-cache';

// import { getDevCli } from './cli';
// import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';

// const cache = Cache({
//   basePath: resolvePathInStorybookCache('dev-server'),
//   ns: 'storybook', // Optional. A grouping namespace for items.
// });

// const caller = (name: string) => async ({ packageJson, ...loadOptions }: any) => {
// const cliOptions = await getDevCli(packageJson);
// const configDir = (loadOptions as any).configDir || cliOptions.configDir || './.storybook';
// const { builder = '@storybook/builder-webpack4' } = require(`${configDir}/main`);
// const exists = require.resolve(builder);
// if (!exists) {
//   throw new Error('no builder bro');
// }
// const options = {
//   ...cliOptions,
//   ...loadOptions,
//   packageJson,
//   configDir: (loadOptions as any).configDir || cliOptions.configDir || './.storybook',
//   ignorePreview: !!cliOptions.previewUrl,
//   docsMode: !!cliOptions.docs,
//   cache,
// };
// const options = {};
// builder[name](options);
// };

const caller = (name: string) => (...args: any[]) => {
  require('@storybook/builder-webpack4')[name](...args);
};

module.exports = {
  buildStatic: caller('buildStatic'),
  buildDev: caller('buildDev'),
};
