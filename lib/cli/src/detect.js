import path from 'path';
import fs from 'fs';

import types, { supportedTemplates, supportedFrameworks } from './project_types';
import { getBowerJson, getPackageJson } from './helpers';

const hasDependency = (packageJson, name) => {
  return !!packageJson.dependencies?.[name] || !!packageJson.devDependencies?.[name];
};

const hasPeerDependency = (packageJson, name) => {
  return !!packageJson.peerDependencies?.[name];
};

const isFramework = (packageJson, framework) => {
  const matches = {
    dependencies: [false],
    peerDependencies: [false],
    files: [false],
  };

  const { preset, files, dependencies, peerDependencies, matcherFunction } = framework;

  if (Array.isArray(dependencies) && dependencies.length > 0) {
    matches.dependencies = dependencies.map((name) => hasDependency(packageJson, name));
  }

  if (Array.isArray(peerDependencies) && peerDependencies.length > 0) {
    matches.peerDependencies = peerDependencies.map((name) => hasPeerDependency(packageJson, name));
  }

  if (Array.isArray(files) && files.length > 0) {
    matches.files = files.map((name) => fs.existsSync(path.join(process.cwd(), name)));
  }

  return matcherFunction(matches) ? preset : null;
};

export function detectFramework(packageJson = {}) {
  const result = supportedTemplates.find((framework) => {
    return isFramework(packageJson, framework) !== null;
  });

  return result ? result.preset : types.UNDETECTED;
}

export function isStorybookInstalled(dependencies, force) {
  if (!dependencies) {
    return false;
  }

  if (!force && dependencies.devDependencies) {
    if (
      supportedFrameworks.reduce(
        (storybookPresent, framework) =>
          storybookPresent || dependencies.devDependencies[`@storybook/${framework}`],
        false
      )
    ) {
      return types.ALREADY_HAS_STORYBOOK;
    }

    if (
      dependencies.devDependencies['@kadira/storybook'] ||
      dependencies.devDependencies['@kadira/react-native-storybook']
    ) {
      return types.UPDATE_PACKAGE_ORGANIZATIONS;
    }
  }
  return false;
}

export function detect(options = {}) {
  if (options.html) {
    return types.HTML;
  }

  const packageJson = getPackageJson();
  const bowerJson = getBowerJson();

  if (!packageJson && !bowerJson) {
    return types.UNDETECTED;
  }

  const storyBookInstalled = isStorybookInstalled(packageJson, options.force);
  if (storyBookInstalled) {
    return storyBookInstalled;
  }

  return detectFramework(packageJson || bowerJson);
}
