import { writePackageJson, getBabelDependencies, copyTemplate } from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    addonActionVersion,
    addonKnobsVersion,
  ] = await packageManager.getVersions(
    '@storybook/marko',
    '@storybook/addon-actions',
    '@storybook/addon-knobs'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/marko@${storybookVersion}`,
    `@storybook/addon-actions@${addonActionVersion}`,
    `@storybook/addon-knobs@${addonKnobsVersion}`,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
