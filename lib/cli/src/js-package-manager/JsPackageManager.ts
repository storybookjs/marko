import { commandLog } from '../helpers';

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

  protected abstract runInstall(): { status: number };
}
