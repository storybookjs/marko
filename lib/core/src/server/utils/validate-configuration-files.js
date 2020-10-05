import dedent from 'ts-dedent';
import deprecate from 'util-deprecate';
import glob from 'glob';
import path from 'path';

import { boost } from './interpret-files';

const warnLegacyConfigurationFiles = deprecate(
  () => {},
  dedent`
    Configuration files such as "config", "presets" and "addons" are deprecated and will be removed in Storybook 7.0.
    Read more about it in the migration guide: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md#to-mainjs-configuration
  `
);

const errorMixingConfigFiles = (first, second, configDir) => {
  const firstPath = path.resolve(configDir, first);
  const secondPath = path.resolve(configDir, second);
  throw new Error(dedent`
    You have mixing configuration files:
    ${firstPath}
    ${secondPath}
    "${first}" and "${second}" cannot coexist.
    Please check the documentation for migration steps: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md#to-mainjs-configuration
  `);
};

export default function validateConfigurationFiles(configDir) {
  const extensionsPattern = `{${Array.from(boost).join(',')}}`;
  const exists = (file) =>
    !!glob.sync(path.resolve(configDir, `${file}${extensionsPattern}`)).length;

  const main = exists('main');
  const config = exists('config');

  if (!main && !config) {
    throw new Error(dedent`
      No configuration files have been found in your configDir (${path.resolve(configDir)}).
      Storybook needs either a "main" or "config" file.
    `);
  }

  if (main && config) {
    throw new Error(dedent`
      You have both a "main" and a "config". Please remove the "config" file from your configDir (${path.resolve(
        configDir,
        'config'
      )})`);
  }

  const presets = exists('presets');
  if (main && presets) {
    errorMixingConfigFiles('main', 'presets', configDir);
  }

  const preview = exists('preview');
  if (preview && config) {
    errorMixingConfigFiles('preview', 'config', configDir);
  }

  const addons = exists('addons');
  const manager = exists('manager');
  if (manager && addons) {
    errorMixingConfigFiles('manager', 'addons', configDir);
  }

  if (presets || config || addons) {
    warnLegacyConfigurationFiles();
  }
}
