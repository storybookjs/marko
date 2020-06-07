import fse from 'fs-extra';
import path from 'path';
import { getVersion, writePackageJson, getBabelDependencies } from '../../helpers';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions) => {
  const storybookVersion = await getVersion(npmOptions, '@storybook/marionette');
  fse.copySync(path.resolve(__dirname, 'template/'), '.', { overwrite: true });

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/marionette@${storybookVersion}`,
    ...babelDependencies,
  ]);
};

export default generator;
