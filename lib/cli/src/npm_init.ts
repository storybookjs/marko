import { sync } from 'cross-spawn';
import { hasYarn } from './has_yarn';

const packageManager = hasYarn() ? 'yarn' : 'npm';

export function npmInit(): string {
  const results = sync(packageManager, ['init', '-y'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
  });
  return results.stdout;
}
