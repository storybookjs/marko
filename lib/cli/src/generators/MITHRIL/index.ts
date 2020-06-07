import {
  getVersions,
  retrievePackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (_packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    knobsVersion,
    addonsVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/mithril',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addons'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [
    `@storybook/mithril@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addon-knobs@${knobsVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
  ]);
};

export default generator;
