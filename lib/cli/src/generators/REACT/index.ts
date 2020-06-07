import { writePackageJson, getBabelDependencies, copyTemplate } from '../../helpers';
import { StoryFormat } from '../../project_types';
import { Generator } from '../Generator';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const packages = [
    '@storybook/react',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
  ];
  if (storyFormat === StoryFormat.MDX) {
    packages.push('@storybook/addon-docs');
  }

  const versionedPackages = await packageManager.getVersionedPackages(npmOptions, ...packages);

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);
};

export default generator;
