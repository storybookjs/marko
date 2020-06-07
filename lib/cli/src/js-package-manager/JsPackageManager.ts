import path from 'path';
import fs from 'fs';
import { commandLog, getVersion, writePackageJson } from '../helpers';
import { PackageJson } from '../PackageJson';
import { NpmOptions } from '../NpmOptions';

const logger = console;

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
      packageJson: PackageJson;
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
   * @param npmOptions
   * @param packageNames
   */
  public getVersionedPackages(
    npmOptions: NpmOptions,
    ...packageNames: string[]
  ): Promise<string[]> {
    return Promise.all(
      packageNames.map(
        async (packageName) => `${packageName}@${await getVersion(npmOptions, packageName)}`
      )
    );
  }

  protected abstract runInstall(): { status: number };

  protected abstract runAddDeps(
    dependencies: string[],
    installAsDevDependencies: boolean
  ): { status: number };

  private static getPackageJson(): PackageJson | false {
    const packageJsonPath = path.resolve('package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(jsonContent);
  }
}
