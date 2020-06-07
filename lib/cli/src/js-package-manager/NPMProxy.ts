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
}
