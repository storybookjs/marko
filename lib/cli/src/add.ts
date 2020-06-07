import path from 'path';
import fs from 'fs';
import { sync as spawnSync } from 'cross-spawn';
import { hasYarn } from './has_yarn';
import { commandLog, getPackageJson } from './helpers';
import { PackageJson } from './PackageJson';
import { JsPackageManager, JsPackageManagerFactory } from './js-package-manager';

const logger = console;
export const storybookAddonScope = '@storybook/addon-';

const isAddon = async (packageManager: JsPackageManager, name: string) => {
  try {
    await packageManager.latestVersion(name);
    return true;
  } catch (e) {
    return false;
  }
};

const isStorybookAddon = async (packageManager: JsPackageManager, name: string) =>
  isAddon(packageManager, `${storybookAddonScope}${name}`);

export const getPackageName = (addonName: string, isOfficialAddon: boolean) =>
  isOfficialAddon ? storybookAddonScope + addonName : addonName;

export const getInstalledStorybookVersion = (packageJson: PackageJson) =>
  packageJson.devDependencies[
    // This only considers the first occurrence.
    Object.keys(packageJson.devDependencies).find((devDep) => /@storybook/.test(devDep))
  ] || false;

export const getPackageArg = (
  addonName: string,
  isOfficialAddon: boolean,
  packageJson: PackageJson
) => {
  if (isOfficialAddon) {
    const addonNameNoTag = addonName.split('@')[0];
    const installedStorybookVersion = getInstalledStorybookVersion(packageJson);
    return installedStorybookVersion
      ? `${addonNameNoTag}@${getInstalledStorybookVersion(packageJson)}`
      : addonName;
  }
  return addonName;
};

const installAddon = (
  addonName: string,
  npmOptions: { useYarn: boolean },
  isOfficialAddon: boolean
) => {
  const prepareDone = commandLog(`Preparing to install the ${addonName} Storybook addon`);
  prepareDone();
  logger.log();

  let result;
  const packageArg = getPackageArg(addonName, isOfficialAddon, getPackageJson());
  if (npmOptions.useYarn) {
    result = spawnSync('yarn', ['add', packageArg, '--dev'], {
      stdio: 'inherit',
    });
  } else {
    result = spawnSync('npm', ['install', packageArg, '--save-dev'], {
      stdio: 'inherit',
    });
  }

  logger.log();
  const installDone = commandLog(`Installing the ${addonName} Storybook addon`);
  if (result.status !== 0) {
    installDone(
      `Something went wrong installing the addon: "${getPackageName(addonName, isOfficialAddon)}"`
    );
    logger.log();
    process.exit(1);
  }
  installDone();
};

export const addStorybookAddonToFile = (
  addonName: string,
  addonsFile: string[],
  isOfficialAddon: boolean
) => {
  const addonNameNoTag = addonName.split('@')[0];
  const alreadyRegistered = addonsFile.find((line) => line.includes(`${addonNameNoTag}/register`));

  if (alreadyRegistered) {
    return addonsFile;
  }

  const latestImportIndex = addonsFile.reduce(
    (prev, curr, currIndex) =>
      curr.startsWith('import') && curr.includes('register') ? currIndex : prev,
    -1
  );

  return [
    ...addonsFile.slice(0, latestImportIndex + 1),
    `import '${getPackageName(addonNameNoTag, isOfficialAddon)}/register';`,
    ...addonsFile.slice(latestImportIndex + 1),
  ];
};

const LEGACY_CONFIGS = ['addons', 'config', 'presets'];

const postinstallAddon = async (addonName: string, isOfficialAddon: boolean) => {
  let skipMsg = null;
  if (!isOfficialAddon) {
    skipMsg = 'unofficial addon';
  } else if (!fs.existsSync('.storybook')) {
    skipMsg = 'no .storybook config';
  } else {
    skipMsg = 'no codmods found';
    LEGACY_CONFIGS.forEach((config) => {
      try {
        const codemod = require.resolve(
          `${getPackageName(addonName, isOfficialAddon)}/postinstall/${config}.js`
        );
        commandLog(`Running postinstall script for ${addonName}`)();
        let configFile = path.join('.storybook', `${config}.ts`);
        if (!fs.existsSync(configFile)) {
          configFile = path.join('.storybook', `${config}.js`);
          if (!fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, '', 'utf8');
          }
        }
        spawnSync('npx', ['jscodeshift', '-t', codemod, configFile], {
          stdio: 'inherit',
        });
        skipMsg = null;
      } catch (err) {
        // resolve failed, skip
      }
    });
  }

  if (skipMsg) {
    commandLog(`Skipping postinstall for ${addonName}, ${skipMsg}`)();
  }
};

export async function add(
  addonName: string,
  options: { useNpm: boolean; skipPostinstall: boolean }
) {
  const useYarn = Boolean(options.useNpm !== true) && hasYarn();
  const npmOptions = {
    useYarn,
  };

  const packageManager = JsPackageManagerFactory.getPackageManager(options.useNpm);

  const addonCheckDone = commandLog(`Verifying that ${addonName} is an addon`);
  const isOfficialAddon = await isStorybookAddon(packageManager, addonName);
  if (!isOfficialAddon) {
    if (!(await isAddon(packageManager, addonName))) {
      addonCheckDone(`The provided package was not a Storybook addon: ${addonName}.`);
      return;
    }
  }
  addonCheckDone();
  installAddon(addonName, npmOptions, isOfficialAddon);
  if (!options.skipPostinstall) {
    await postinstallAddon(addonName, isOfficialAddon);
  }
}
