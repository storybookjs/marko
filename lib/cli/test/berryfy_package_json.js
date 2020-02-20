#!/usr/bin/env node

// Map between SB packages names and their folders inside this monorepo
const sbRootDir = '../../../../..';
const sbPackagesResolutionsMap = {
  '@storybook/addons': `portal:${sbRootDir}/lib/addons`,
  '@storybook/api': `portal:${sbRootDir}/lib/api`,
  '@storybook/channel-postmessage': `portal:${sbRootDir}/lib/channel-postmessage`,
  '@storybook/channel-websocket': `portal:${sbRootDir}/lib/channel-websocket`,
  '@storybook/channels': `portal:${sbRootDir}/lib/channels`,
  '@storybook/cli': `portal:${sbRootDir}/lib/cli`,
  '@storybook/core': `portal:${sbRootDir}/lib/core`,
  '@storybook/source-loader': `portal:${sbRootDir}/lib/source-loader`,
  '@storybook/router': `portal:${sbRootDir}/lib/router`,
  '@storybook/theming': `portal:${sbRootDir}/lib/theming`,
  '@storybook/ui': `portal:${sbRootDir}/lib/ui`,
  '@storybook/ember': `portal:${sbRootDir}/app/ember`,
  '@storybook/html': `portal:${sbRootDir}/app/html`,
  '@storybook/marionette': `portal:${sbRootDir}/app/marionette`,
  '@storybook/marko': `portal:${sbRootDir}/app/marko`,
  '@storybook/mithril': `portal:${sbRootDir}/app/mithril`,
  '@storybook/preact': `portal:${sbRootDir}/app/preact`,
  '@storybook/rax': `portal:${sbRootDir}/app/rax`,
  '@storybook/react': `portal:${sbRootDir}/app/react`,
  '@storybook/riot': `portal:${sbRootDir}/app/riot`,
  '@storybook/server': `portal:${sbRootDir}/app/server`,
  '@storybook/svelte': `portal:${sbRootDir}/app/svelte`,
  '@storybook/vue': `portal:${sbRootDir}/app/vue`,
  '@storybook/web-components': `portal:${sbRootDir}/app/web-components`,
  '@storybook/addon-actions': `portal:${sbRootDir}/addons/actions`,
  '@storybook/addon-links': `portal:${sbRootDir}/addons/links`,
  '@storybook/addon-knobs': `portal:${sbRootDir}/addons/knobs`,
};

const fs = require('fs');

const args = process.argv.slice(2);

if (args.length !== 1) {
  throw Error('This script must be ran with 1 argument: the path of the package.json to update');
}

const packageJsonPath = args[0];
const packageJson = require(packageJsonPath);

// Add `@storybook/cli` as dev dependency to be able to do `yarn sb init` with Yarn 2
packageJson.devDependencies = {
  ...packageJson.devDependencies,
  '@storybook/cli': 'next',
};

// Link `@storybook/xxx` package to local one by filling `resolutions` attribute using "portal" protocol (https://yarnpkg.com/features/protocols)
// We have to do it like this for now because we can not used Yarn v1 workspace.
// This can be rework when the whole monorepo will be migrated to Yarn 2
packageJson.resolutions = {
  ...packageJson.resolutions,
  ...sbPackagesResolutionsMap,
};

// Get a string representing updated `package.json` and write it
const prettyUpdatedPackageJson = JSON.stringify(packageJson, null, 2);
fs.writeFileSync(packageJsonPath, prettyUpdatedPackageJson);
