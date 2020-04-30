import path from 'path';
import fs from 'fs';

import {
  PROJECT_TYPES,
  supportedTemplates,
  SUPPORTED_FRAMEWORKS,
  SUPPORTED_LANGUAGES,
} from './project_types';
import { getBowerJson, getPackageJson } from './helpers';

const hasDependency = (packageJson, name) => {
  return !!packageJson.dependencies?.[name] || !!packageJson.devDependencies?.[name];
};

const hasPeerDependency = (packageJson, name) => {
  return !!packageJson.peerDependencies?.[name];
};

/**
 * Returns a framework preset based on a given configuration.
 *
 * @param {Object} packageJson contains `dependencies`, `devDependencies`
 * and/or `peerDependencies` which we use to get installed packages.
 * @param {Object} framework contains a configuration of a framework preset.
 * Refer to supportedTemplates in project_types.js for more info.
 * @returns a preset name like PROJECT_TYPES.REACT, or null if not found.
 * @example
 * getFrameworkPreset(packageJson,  * {
 *   preset: PROJECT_TYPES.REACT,
 *   dependencies: ['react'],
 *   matcherFunction: ({ dependencies }) => {
 *     return dependencies.every(Boolean);
 *   },
 * });
 */
const getFrameworkPreset = (packageJson, framework) => {
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

export function detectFrameworkPreset(packageJson = {}) {
  const result = supportedTemplates.find((framework) => {
    return getFrameworkPreset(packageJson, framework) !== null;
  });

  return result ? result.preset : PROJECT_TYPES.UNDETECTED;
}

export function isStorybookInstalled(dependencies, force) {
  if (!dependencies) {
    return false;
  }

  if (!force && dependencies.devDependencies) {
    if (
      SUPPORTED_FRAMEWORKS.reduce(
        (storybookPresent, framework) =>
          storybookPresent || dependencies.devDependencies[`@storybook/${framework}`],
        false
      )
    ) {
      return PROJECT_TYPES.ALREADY_HAS_STORYBOOK;
    }

    if (
      dependencies.devDependencies['@kadira/storybook'] ||
      dependencies.devDependencies['@kadira/react-native-storybook']
    ) {
      return PROJECT_TYPES.UPDATE_PACKAGE_ORGANIZATIONS;
    }
  }
  return false;
}

export function detectLanguage() {
  let language = SUPPORTED_LANGUAGES.JAVASCRIPT;
  const packageJson = getPackageJson();
  const bowerJson = getBowerJson();
  if (!packageJson && !bowerJson) {
    return language;
  }

  if (hasDependency(packageJson || bowerJson, 'typescript')) {
    language = SUPPORTED_LANGUAGES.TYPESCRIPT;
  }

  return language;
}

export function detect(options = {}) {
  const packageJson = getPackageJson();
  const bowerJson = getBowerJson();

  if (!packageJson && !bowerJson) {
    return PROJECT_TYPES.UNDETECTED;
  }

  const storyBookInstalled = isStorybookInstalled(packageJson, options.force);
  if (storyBookInstalled) {
    return storyBookInstalled;
  }

  if (options.html) {
    return PROJECT_TYPES.HTML;
  }

  return detectFrameworkPreset(packageJson || bowerJson);
}
