import { sync as spawnSync } from 'cross-spawn';
import { JsPackageManager } from './JsPackageManager';

export class Yarn1Proxy extends JsPackageManager {
  initPackageJson() {
    const results = spawnSync('yarn', ['init', '-y'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    return results.stdout;
  }

  getRunStorybookCommand(): string {
    return 'yarn storybook';
  }

  protected runInstall(): { status: number } {
    return spawnSync('yarn', { stdio: 'inherit' });
  }
}
