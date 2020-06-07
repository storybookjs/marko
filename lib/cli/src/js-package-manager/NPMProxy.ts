import { sync as spawnSync } from 'cross-spawn';
import { JsPackageManager } from './JsPackageManager';

export class NPMProxy extends JsPackageManager {
  initPackageJson() {
    const results = spawnSync('npm', ['init', '-y'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    return results.stdout;
  }

  getRunStorybookCommand(): string {
    return 'npm run storybook';
  }

  protected runInstall(): { status: number } {
    return spawnSync('npm', ['install'], { stdio: 'inherit' });
  }

  protected runAddDeps(
    dependencies: string[],
    installAsDevDependencies: boolean
  ): { status: number } {
    const args = ['install', ...dependencies];

    if (installAsDevDependencies) {
      args.push('-D');
    }

    return spawnSync('npm', args, { stdio: 'inherit' });
  }

  protected runGetVersions<T extends boolean>(
    packageName: string,
    fetchAllVersions: T
  ): Promise<T extends true ? string[] : string> {
    const commandResult = spawnSync(
      'npm',
      ['info', packageName, fetchAllVersions ? 'versions' : 'version', '--json'],
      {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'pipe',
        encoding: 'utf-8',
      }
    );

    if (commandResult.status !== 0) {
      throw new Error(commandResult.stderr.toString());
    }

    try {
      const parsedOutput = JSON.parse(commandResult.stdout.toString());

      if (parsedOutput.error) {
        // FIXME: improve error handling
        throw new Error(parsedOutput.error.summary);
      } else {
        return parsedOutput;
      }
    } catch (e) {
      throw new Error(`Unable to find versions of ${packageName} using yarn`);
    }
  }
}
