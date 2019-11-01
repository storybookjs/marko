import path from 'path';
import {
  retrievePackageJson,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  getPackageJson,
  writeFileAsJson,
  copyTemplate,
  readFileAsJson,
} from '../../lib/helpers';

function addStorybookExcludeGlobToTsConfig() {
  const tsConfigJson = readFileAsJson('tsconfig.json', true);
  const glob = '**/*.stories.ts';
  if (!tsConfigJson) {
    return;
  }

  const { exclude = [] } = tsConfigJson;
  if (exclude.includes(glob)) {
    return;
  }

  tsConfigJson.exclude = [...exclude, glob];
  writeFileAsJson('tsconfig.json', tsConfigJson);
}

export default async (npmOptions, { storyFormat = 'csf' }) => {
  copyTemplate(__dirname, storyFormat);
  const packages = [
    '@storybook/aurelia',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    '@storybook/addon-storysource',
    '@storybook/addon-notes',
    '@storybook/addon-knobs',
    '@storybook/addon-options',
    '@storybook/addon-a11y',
    '@storybook/addon-backgrounds',
    'aurelia',
  ];

  if (storyFormat === 'mdx') {
    packages.push('@storybook/addon-docs');
  }

  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);
  const packageJson = getPackageJson();
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';
  writePackageJson(packageJson);
  addStorybookExcludeGlobToTsConfig();
  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);
  installDependencies(npmOptions, [...versionedPackages, ...babelDependencies]);
};
