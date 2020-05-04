import fse from 'fs-extra';
import path from 'path';
import {
  getVersion,
  getVersionedPackages,
  retrievePackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../helpers';
import { STORY_FORMAT } from '../../project_types';

export default async (npmOptions, { storyFormat }) => {
  const packages = [
    '@storybook/web-components',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    'lit-html',
  ];

  if (storyFormat === STORY_FORMAT.MDX) {
    // TODO: handle adding of docs mode
  }

  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  fse.copySync(path.resolve(__dirname, 'template/'), '.', { overwrite: true });

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
};
