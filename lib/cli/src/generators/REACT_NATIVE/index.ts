import shell from 'shelljs';
import chalk from 'chalk';
import { paddedLog, copyTemplate } from '../../helpers';
import { NpmOptions } from '../../NpmOptions';
import { baseGenerator, GeneratorOptions } from '../baseGenerator';
import { JsPackageManager } from '../../js-package-manager';

const generator = async (
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  installServer: boolean,
  options: GeneratorOptions
): Promise<void> => {
  // set correct project name on entry files if possible
  const dirname = shell.ls('-d', 'ios/*.xcodeproj').stdout;

  // Only notify about app name if running in React Native vanilla (Expo projects do not have ios directory)
  if (dirname) {
    const projectName = dirname.slice('ios/'.length, dirname.length - '.xcodeproj'.length - 1);

    if (projectName) {
      shell.sed('-i', '%APP_NAME%', projectName, 'storybook/storybook.js');
    } else {
      paddedLog(
        chalk.red(
          'ERR: Could not determine project name, to fix: https://github.com/storybookjs/storybook/issues/1277'
        )
      );
    }
  }

  const packageJson = packageManager.retrievePackageJson();

  const missingReactDom =
    !packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom'];
  const reactVersion = packageJson.dependencies.react;

  await baseGenerator(packageManager, npmOptions, options, 'react-native', {
    extraPackages: [
      missingReactDom && reactVersion && `react-dom@${reactVersion}`,
      installServer && '@storybook/react-native-server',
    ].filter(Boolean),
    addScripts: installServer,
    addComponents: false, // We copy template-csf as it's wrapped in a storybook folder
  });
  copyTemplate(__dirname, options.storyFormat);
};

export default generator;
