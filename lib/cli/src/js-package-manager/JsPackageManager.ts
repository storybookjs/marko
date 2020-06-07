import path from 'path';
import fs from 'fs';
import { commandLog } from '../helpers';
import { PackageJson } from '../PackageJson';

const logger = console;

export abstract class JsPackageManager {
  public abstract initPackageJson(): void;

  public abstract getRunStorybookCommand(): string;

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

  protected abstract runInstall(): { status: number };

  private static getPackageJson(): PackageJson | false {
    const packageJsonPath = path.resolve('package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(jsonContent);
  }
}
