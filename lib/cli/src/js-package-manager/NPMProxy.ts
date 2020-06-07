import spawn from 'cross-spawn';
import { JsPackageManager } from './JsPackageManager';

export class NPMProxy extends JsPackageManager {
  initPackageJson() {
    const results = spawn.sync('npm', ['init', '-y'], {
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
}
