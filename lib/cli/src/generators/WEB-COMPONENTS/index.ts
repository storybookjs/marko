import fse from 'fs-extra';
import path from 'path';
import {
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../helpers';
import { StoryFormat } from '../../project_types';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const packages = [
    '@storybook/web-components',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    'lit-html',
  ];

  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  fse.copySync(path.resolve(__dirname, 'template/'), '.', { overwrite: true });

  if (storyFormat === StoryFormat.MDX) {
    // TODO: handle adding of docs mode
  }

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
};

export default generator;
