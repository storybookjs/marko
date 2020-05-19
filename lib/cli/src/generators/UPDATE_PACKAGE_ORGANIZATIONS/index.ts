/* eslint-disable no-param-reassign */
import path from 'path';
import { sync as spawnSync } from 'cross-spawn';
import { packageNames } from '@storybook/codemod';
import {
  getBabelDependencies,
  getPackageJson,
  getVersion,
  getVersions,
  installDependencies,
  writePackageJson,
} from '../../helpers';
import { PackageJson } from '../../PackageJson';
import { NpmOptions } from '../../NpmOptions';

async function updatePackage(
  devDependencies: PackageJson['devDependencies'],
  oldName: string,
  newName: string,
  npmOptions: NpmOptions
) {
  if (devDependencies[oldName]) {
    delete devDependencies[oldName];
    devDependencies[newName] = await getVersion(npmOptions, newName);
  }
}

async function updatePackageJson(npmOptions: NpmOptions) {
  const packageJson = getPackageJson();
  const { devDependencies } = packageJson;

  const [actionsVersion, linksVersion] = await getVersions(
    npmOptions,
    '@storybook/addon-actions',
    '@storybook/addon-links'
  );

  devDependencies['@storybook/addon-actions'] = actionsVersion;
  devDependencies['@storybook/addon-links'] = linksVersion;

  await Promise.all(
    Object.keys(packageNames).map((oldName) => {
      const newName = packageNames[oldName];
      return updatePackage(devDependencies, oldName, newName, npmOptions);
    })
  );

  if (!devDependencies['@storybook/react'] && !devDependencies['@storybook/react-native']) {
    throw new Error('Expected to find `@kadira/[react-native]-storybook` in devDependencies');
  }

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  if (babelDependencies.length > 0) {
    installDependencies({ ...npmOptions, packageJson }, babelDependencies);
  }
}

function updateSourceCode(parser: string) {
  const jscodeshiftPath = path.dirname(require.resolve('jscodeshift'));
  const jscodeshiftCommand = path.join(jscodeshiftPath, 'bin', 'jscodeshift.sh');

  ['update-organisation-name.js', 'move-buildin-addons.js'].forEach((codemod) => {
    const codemodPath = path.join(
      path.dirname(require.resolve('@storybook/codemod')),
      'transforms',
      codemod
    );

    const args = ['-t', codemodPath, '--silent', '--ignore-pattern', '"node_modules|dist"', '.'];
    if (parser) args.push('--parser', parser);

    spawnSync(jscodeshiftCommand, args, { stdio: 'inherit' });
  });
}

export default async (parser: string, npmOptions: NpmOptions) => {
  await updatePackageJson(npmOptions);
  updateSourceCode(parser);
};
