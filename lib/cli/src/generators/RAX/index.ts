import { baseGenerator, Generator } from '../baseGenerator';
import { writePackageJson } from '../../js-package-manager';

const generator: Generator = async (packageManager, npmOptions, options) => {
  const [latestRaxVersion] = await packageManager.getVersions('rax');
  const packageJson = packageManager.retrievePackageJson();

  const raxVersion = packageJson.dependencies.rax || latestRaxVersion;

  // in case Rax project is not detected, `rax` package is not available either
  packageJson.dependencies.rax = packageJson.dependencies.rax || raxVersion;

  // these packages are required for Welcome story
  packageJson.dependencies['rax-image'] = packageJson.dependencies['rax-image'] || raxVersion;
  packageJson.dependencies['rax-link'] = packageJson.dependencies['rax-link'] || raxVersion;
  packageJson.dependencies['rax-text'] = packageJson.dependencies['rax-text'] || raxVersion;
  packageJson.dependencies['rax-view'] = packageJson.dependencies['rax-view'] || raxVersion;

  writePackageJson(packageJson);

  baseGenerator(packageManager, npmOptions, options, 'rax', {
    extraPackages: ['rax'],
  });
};

export default generator;
