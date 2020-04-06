import dedent from 'ts-dedent';
import deprecate from 'util-deprecate';
import glob from 'glob';
import path from 'path';

import { boost } from './interpret-files';

const warnLegacyConfigurationFiles = deprecate(
  () => {},
  dedent`
    Configuration files such as "config", "presets" and "addons" are deprecated and will be removed in Storybook 7.0.
    Read more about it in the migration guide: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md
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
    Please check the documentation for migration steps: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md
  `);
};

export default function validateConfigurationFiles(configDir) {
  const exists = (pattern) => !!glob.sync(path.resolve(configDir, pattern)).length;
  const extensionsPattern = `{${Array.from(boost).join(',')}}`;

  const main = exists(`main${extensionsPattern}`);
  const config = exists(`config${extensionsPattern}`);

  if (main && config) {
    throw new Error(dedent`
      You have both a "main" and a "config". Please remove the "config" file from your configDir (${path.resolve(
        configDir,
        'config'
      )})`);
  }

  if (!main && !config) {
    throw new Error(dedent`
      No configuration files have been found in your configDir (${path.resolve(configDir)}).
      Storybook needs either a "main" or "config" file.
    `);
  }

  const presets = exists(`presets${extensionsPattern}`);
  if (main && presets) {
    errorMixingConfigFiles('main', 'presets', configDir);
  }

  const preview = exists(`preview${extensionsPattern}`);
  if (preview && config) {
    errorMixingConfigFiles('preview', 'config', configDir);
  }

  const addons = exists(`addons${extensionsPattern}`);
  const manager = exists(`manager${extensionsPattern}`);
  if (manager && addons) {
    errorMixingConfigFiles('manager', 'addons', configDir);
  }

  if (presets || config || addons) {
    warnLegacyConfigurationFiles();
  }
}
