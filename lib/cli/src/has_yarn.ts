import { sync } from 'cross-spawn';
import path from 'path';
import findUp from 'find-up';

export function hasYarn() {
  const yarnAvailable = sync('yarn', ['--version']);
  const npmAvailable = sync('npm', ['--version']);

  const lockFile = findUp.sync(['yarn.lock', 'package-lock.json']);
  const hasYarnLock = lockFile && path.basename(lockFile) === 'yarn.lock';

  if (yarnAvailable && yarnAvailable.status === 0 && (hasYarnLock || npmAvailable.status !== 0)) {
    return true;
  }
  return false;
}
