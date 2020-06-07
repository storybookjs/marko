import fse from 'fs-extra';
import path from 'path';
import { writePackageJson, getBabelDependencies } from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions) => {
  const storybookVersion = await packageManager.getVersion('@storybook/marionette');
  fse.copySync(path.resolve(__dirname, 'template/'), '.', { overwrite: true });

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/marionette@${storybookVersion}`,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
