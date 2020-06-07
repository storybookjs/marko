import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { gt, satisfies } from '@storybook/semver';
import { commandLog, writePackageJson } from '../helpers';
import { PackageJson } from './PackageJson';

const logger = console;
// Cannot be `import` as it's not under TS root dir
const { storybookCLIVersion, devDependencies } = require('../../package.json');

export abstract class JsPackageManager {
  public abstract initPackageJson(): void;

  public abstract getRunStorybookCommand(): string;

  /**
   * Install dependencies listed in `package.json`
   */
  public installDependencies(): void {
    let done = commandLog('Preparing to install dependencies');
    done();
    logger.log();

    const result = this.runInstall();

    logger.log();
    done = commandLog('Installing dependencies');
    if (result.status !== 0) {
      done('An error occurred while installing dependencies.');
      process.exit(1);
    }
    done();
  }

  public retrievePackageJson(): PackageJson {
    const existing = JsPackageManager.getPackageJson();
    if (existing) {
      return existing;
    }

    // It will create a new package.json file
    this.initPackageJson();

    // read the newly created package.json file
    return JsPackageManager.getPackageJson() || {};
  }

  /**
   * Add dependencies to a project using `yarn add` or `npm install`.
   *
   * @param {Object} options contains `skipInstall`, `packageJson` and `installAsDevDependencies` which we use to determine how we install packages.
   * @param {Array} dependencies contains a list of packages to add.
   * @example
   * addDependencies(options, [
   *   `@storybook/react@${storybookVersion}`,
   *   `@storybook/addon-actions@${actionsVersion}`,
   *   `@storybook/addon-links@${linksVersion}`,
   *   `@storybook/addons@${addonsVersion}`,
   * ]);
   */
  public addDependencies(
    options: {
      skipInstall?: boolean;
      installAsDevDependencies?: boolean;
      packageJson?: PackageJson;
    },
    dependencies: string[]
  ): void {
    const { skipInstall } = options;

    if (skipInstall) {
      const { packageJson } = options;

      const dependenciesMap = dependencies.reduce((acc, dep) => {
        const idx = dep.lastIndexOf('@');
        const packageName = dep.slice(0, idx);
        const packageVersion = dep.slice(idx + 1);

        return { ...acc, [packageName]: packageVersion };
      }, {});

      if (options.installAsDevDependencies) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          ...dependenciesMap,
        };
      } else {
        packageJson.dependencies = {
          ...packageJson.dependencies,
          ...dependenciesMap,
        };
      }

      writePackageJson(packageJson);
    } else {
      const dependencyResult = this.runAddDeps(dependencies, options.installAsDevDependencies);

      if (dependencyResult.status !== 0) {
        logger.error('An error occurred while installing dependencies.');
        logger.log(dependencyResult);
        process.exit(1);
      }
    }
  }

  /**
   * Return an array of strings matching following format: `<package_name>@<package_latest_version>`
   *
   * @param packageNames
   */
  public getVersionedPackages(...packageNames: string[]): Promise<string[]> {
    return Promise.all(
      packageNames.map(
        async (packageName) => `${packageName}@${await this.getVersion(packageName)}`
      )
    );
  }

  /**
   * Return an array of string standing for the latest version of the input packages.
   * To be able to identify which version goes with which package the order of the input array is keep.
   *
   * @param packageNames
   */
  public getVersions(...packageNames: string[]): Promise<string[]> {
    return Promise.all(packageNames.map((packageName) => this.getVersion(packageName)));
  }

  public async getVersion(packageName: string, constraint?: string): Promise<string> {
    let current;
    if (packageName === '@storybook/cli') {
      current = storybookCLIVersion;
    } else if (/storybook/.test(packageName)) {
      current = devDependencies[packageName];
    }

    let latest;
    try {
      latest = await this.latestVersion(packageName, constraint);
    } catch (e) {
      if (current) {
        logger.warn(`\n     ${chalk.yellow(e.message)}`);
        return current;
      }

      logger.error(`\n     ${chalk.red(e.message)}`);
      process.exit(1);
    }

    const versionToUse =
      current && (!constraint || satisfies(current, constraint)) && gt(current, latest)
        ? current
        : latest;
    return `^${versionToUse}`;
  }

  /**
   * Get the latest version of the package available on npmjs.com.
   * If constraint is set then it returns a version satisfying it, otherwise the latest version available is returned.
   *
   * @param packageName Name of the package
   * @param constraint Version range to use to constraint the returned version
   */
  public async latestVersion(packageName: string, constraint?: string): Promise<string> {
    if (!constraint) {
      return this.runGetVersions(packageName, false);
    }

    const versions = await this.runGetVersions(packageName, true);

    // Get the latest version satisfying the constraint
    return versions.reverse().find((version) => satisfies(version, constraint));
  }

  protected abstract runInstall(): { status: number };

  protected abstract runAddDeps(
    dependencies: string[],
    installAsDevDependencies: boolean
  ): { status: number };

  /**
   * Get the latest or all versions of the input package available on npmjs.com
   *
   * @param packageName Name of the package
   * @param fetchAllVersions Should return
   */
  protected abstract runGetVersions<T extends boolean>(
    packageName: string,
    fetchAllVersions: T
  ): // Use generic and conditional type to force `string[]` if fetchAllVersions is true and `string` if false
  Promise<T extends true ? string[] : string>;

  private static getPackageJson(): PackageJson | false {
    const packageJsonPath = path.resolve('package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(jsonContent);
  }
}
