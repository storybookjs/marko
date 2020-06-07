import path from 'path';
import {
  isDefaultProjectSet,
  editStorybookTsConfig,
  getAngularAppTsConfigJson,
  getAngularAppTsConfigPath,
} from './angular-helpers';
import {
  writePackageJson,
  getBabelDependencies,
  writeFileAsJson,
  copyTemplate,
} from '../../helpers';
import { StoryFormat } from '../../project_types';
import { NpmOptions } from '../../NpmOptions';
import { Generator, GeneratorOptions } from '../Generator';
import { JsPackageManager } from '../../js-package-manager';

async function addDependencies(
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  { storyFormat }: GeneratorOptions
) {
  const packages = [
    '@storybook/angular',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
  ];

  if (storyFormat === StoryFormat.MDX) {
    packages.push('@storybook/addon-docs');
  }

  const versionedPackages = await packageManager.getVersionedPackages(...packages);

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
}

function editAngularAppTsConfig() {
  const tsConfigJson = getAngularAppTsConfigJson();
  const glob = '**/*.stories.ts';
  if (!tsConfigJson) {
    return;
  }

  const { exclude = [] } = tsConfigJson;
  if (exclude.includes(glob)) {
    return;
  }

  tsConfigJson.exclude = [...exclude, glob];
  writeFileAsJson(getAngularAppTsConfigPath(), tsConfigJson);
}

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  if (!isDefaultProjectSet()) {
    throw new Error(
      'Could not find a default project in your Angular workspace.\nSet a defaultProject in your angular.json and re-run the installation.'
    );
  }

  copyTemplate(__dirname, storyFormat);

  await addDependencies(packageManager, npmOptions, { storyFormat });
  editAngularAppTsConfig();
  editStorybookTsConfig(path.resolve('./.storybook/tsconfig.json'));
};

export default generator;
