import * as path from 'path';
import * as fs from 'fs';
import { readFileAsJson, writeFileAsJson } from '../../helpers';

type TsConfig = {
  extends: string;
};

export function getAngularAppTsConfigPath() {
  const angularJson = readFileAsJson('angular.json', true);
  const { defaultProject } = angularJson;
  const tsConfigPath = angularJson.projects[defaultProject].architect.build.options.tsConfig;

  if (!tsConfigPath || !fs.existsSync(path.resolve(tsConfigPath))) {
    return false;
  }
  return tsConfigPath;
}

export function getAngularAppTsConfigJson() {
  const tsConfigPath = getAngularAppTsConfigPath();

  if (!tsConfigPath) {
    return false;
  }

  return readFileAsJson(tsConfigPath, true);
}

function setStorybookTsconfigExtendsPath(tsconfigJson: TsConfig) {
  const angularProjectTsConfigPath = getAngularAppTsConfigPath();
  const newTsconfigJson = { ...tsconfigJson };
  newTsconfigJson.extends = `../${angularProjectTsConfigPath}`;
  return newTsconfigJson;
}

export function editStorybookTsConfig(tsconfigPath: string) {
  let tsConfigJson;
  try {
    tsConfigJson = readFileAsJson(tsconfigPath);
  } catch (e) {
    if (e.name === 'SyntaxError' && e.message.indexOf('Unexpected token /') > -1) {
      throw new Error(`Comments are disallowed in ${tsconfigPath}`);
    }
    throw e;
  }
  tsConfigJson = setStorybookTsconfigExtendsPath(tsConfigJson);
  writeFileAsJson(tsconfigPath, tsConfigJson);
}

export function isDefaultProjectSet() {
  const angularJson = readFileAsJson('angular.json', true);
  return angularJson && !!angularJson.defaultProject;
}
