import {
  writePackageJson,
  getBabelDependencies,
  writeFileAsJson,
  copyTemplate,
  readFileAsJson,
} from '../../helpers';
import { Generator } from '../Generator';
import { StoryFormat } from '../../project_types';

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
const generator: Generator = async (
  packageManager,
  npmOptions,
  { storyFormat = StoryFormat.CSF }
) => {
  copyTemplate(__dirname, storyFormat);
  const packages = [
    '@storybook/aurelia',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    '@storybook/addon-options',
    '@storybook/addon-a11y',
    '@storybook/addon-backgrounds',
    'aurelia',
  ];

  if (storyFormat === 'mdx') {
    packages.push('@storybook/addon-docs');
  }

  const versionedPackages = await packageManager.getVersionedPackages(...packages);
  const packageJson = packageManager.retrievePackageJson();
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';
  writePackageJson(packageJson);
  addStorybookExcludeGlobToTsConfig();
  const babelDependencies = await getBabelDependencies(packageManager, packageJson);
  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);
};

export default generator;
