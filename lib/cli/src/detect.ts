import path from 'path';
import fs from 'fs';

import {
  ProjectType,
  supportedTemplates,
  SUPPORTED_FRAMEWORKS,
  SupportedLanguage,
  TemplateConfiguration,
  TemplateMatcher,
} from './project_types';
import { getBowerJson } from './helpers';
import { PackageJson, readPackageJson } from './js-package-manager';

const hasDependency = (packageJson: PackageJson, name: string) => {
  return !!packageJson.dependencies?.[name] || !!packageJson.devDependencies?.[name];
};

const hasPeerDependency = (packageJson: PackageJson, name: string) => {
  return !!packageJson.peerDependencies?.[name];
};

const getFrameworkPreset = (
  packageJson: PackageJson,
  framework: TemplateConfiguration
): ProjectType | null => {
  const matcher: TemplateMatcher = {
    dependencies: [false],
    peerDependencies: [false],
    files: [false],
  };

  const { preset, files, dependencies, peerDependencies, matcherFunction } = framework;

  if (Array.isArray(dependencies) && dependencies.length > 0) {
    matcher.dependencies = dependencies.map((name) => hasDependency(packageJson, name));
  }

  if (Array.isArray(peerDependencies) && peerDependencies.length > 0) {
    matcher.peerDependencies = peerDependencies.map((name) => hasPeerDependency(packageJson, name));
  }

  if (Array.isArray(files) && files.length > 0) {
    matcher.files = files.map((name) => fs.existsSync(path.join(process.cwd(), name)));
  }

  return matcherFunction(matcher) ? preset : null;
};

export function detectFrameworkPreset(packageJson = {}) {
  const result = supportedTemplates.find((framework) => {
    return getFrameworkPreset(packageJson, framework) !== null;
  });

  return result ? result.preset : ProjectType.UNDETECTED;
}

export function isStorybookInstalled(dependencies: PackageJson | false, force?: boolean) {
  if (!dependencies) {
    return false;
  }

  if (!force && dependencies.devDependencies) {
    if (
      SUPPORTED_FRAMEWORKS.reduce(
        (storybookPresent, framework) =>
          storybookPresent || !!dependencies.devDependencies[`@storybook/${framework}`],
        false
      )
    ) {
      return ProjectType.ALREADY_HAS_STORYBOOK;
    }

    if (
      dependencies.devDependencies['@kadira/storybook'] ||
      dependencies.devDependencies['@kadira/react-native-storybook']
    ) {
      return ProjectType.UPDATE_PACKAGE_ORGANIZATIONS;
    }
  }
  return false;
}

export function detectLanguage() {
  let language = SupportedLanguage.JAVASCRIPT;
  const packageJson = readPackageJson();
  const bowerJson = getBowerJson();
  if (!packageJson && !bowerJson) {
    return language;
  }

  if (hasDependency(packageJson || bowerJson, 'typescript')) {
    language = SupportedLanguage.TYPESCRIPT;
  }

  return language;
}

export function detect(options: { force?: boolean; html?: boolean } = {}) {
  const packageJson = readPackageJson();
  const bowerJson = getBowerJson();

  if (!packageJson && !bowerJson) {
    return ProjectType.UNDETECTED;
  }

  const storyBookInstalled = isStorybookInstalled(packageJson, options.force);
  if (storyBookInstalled) {
    return storyBookInstalled;
  }

  if (options.html) {
    return ProjectType.HTML;
  }

  return detectFrameworkPreset(packageJson || bowerJson);
}
