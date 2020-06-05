import spawn from 'cross-spawn';
import { JsPackageManager } from './JsPackageManager';

export class Yarn1Proxy extends JsPackageManager {
  initPackageJson() {
    const results = spawn.sync('yarn', ['init', '-y'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    return results.stdout;
  }
}
