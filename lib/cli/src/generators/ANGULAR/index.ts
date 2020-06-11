import path from 'path';
import {
  isDefaultProjectSet,
  editStorybookTsConfig,
  getAngularAppTsConfigJson,
  getAngularAppTsConfigPath,
} from './angular-helpers';
import { writeFileAsJson, copyTemplate } from '../../helpers';
import { baseGenerator, Generator } from '../baseGenerator';

function editAngularAppTsConfig() {
  const tsConfigJson = getAngularAppTsConfigJson();
  const glob = '**/*.stories.*';
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

const generator: Generator = async (packageManager, npmOptions, options) => {
  if (!isDefaultProjectSet()) {
    throw new Error(
      'Could not find a default project in your Angular workspace.\nSet a defaultProject in your angular.json and re-run the installation.'
    );
  }
  baseGenerator(packageManager, npmOptions, options, 'angular');
  copyTemplate(__dirname, options.storyFormat);

  editAngularAppTsConfig();
  editStorybookTsConfig(path.resolve('./.storybook/tsconfig.json'));
};

export default generator;
