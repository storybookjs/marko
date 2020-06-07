import { writePackageJson, getBabelDependencies, copyTemplate } from '../../helpers';
import { StoryFormat } from '../../project_types';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const packages = ['@storybook/html', '@storybook/addon-actions', '@storybook/addon-links'];
  if (storyFormat === StoryFormat.MDX) {
    packages.push('@storybook/addon-docs');
  }

  const versionedPackages = await packageManager.getVersionedPackages(...packages);

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);
  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
