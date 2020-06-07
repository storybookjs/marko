import spawn from 'cross-spawn';
import { JsPackageManager } from './JsPackageManager';

export class Yarn2Proxy extends JsPackageManager {
  initPackageJson() {
    const results = spawn.sync('yarn', ['init'], {
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
}
