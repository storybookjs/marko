import fetch from 'node-fetch';
import chalk from 'chalk';
import { colors } from '@storybook/node-logger';
import semver from '@storybook/semver';
import dedent from 'ts-dedent';
import { VersionCheck } from '@storybook/core-common';
import { cache } from './cache';

const { STORYBOOK_VERSION_BASE = 'https://storybook.js.org' } = process.env;

export const updateCheck = async (version: string): Promise<VersionCheck> => {
  let result;
  const time = Date.now();
  try {
    const fromCache = await cache.get('lastUpdateCheck', { success: false, time: 0 });

    // if last check was more then 24h ago
    if (time - 86400000 > fromCache.time) {
      const fromFetch: any = await Promise.race([
        fetch(`${STORYBOOK_VERSION_BASE}/versions.json?current=${version}`),
        // if fetch is too slow, we won't wait for it
        new Promise((res, rej) => global.setTimeout(rej, 1500)),
      ]);
      const data = await fromFetch.json();
      result = { success: true, data, time };
      await cache.set('lastUpdateCheck', result);
    } else {
      result = fromCache;
    }
  } catch (error) {
    result = { success: false, error, time };
  }
  return result;
};

export function createUpdateMessage(updateInfo: VersionCheck, version: string): string {
  let updateMessage;

  try {
    const suffix = semver.prerelease(updateInfo.data.latest.version) ? '--prerelease' : '';
    const upgradeCommand = `npx sb@latest upgrade ${suffix}`.trim();
    updateMessage =
      updateInfo.success && semver.lt(version, updateInfo.data.latest.version)
        ? dedent`
          ${colors.orange(
            `A new version (${chalk.bold(updateInfo.data.latest.version)}) is available!`
          )}

          ${chalk.gray('Upgrade now:')} ${colors.green(upgradeCommand)}

          ${chalk.gray('Read full changelog:')} ${chalk.gray.underline('https://git.io/fhFYe')}
        `
        : '';
  } catch (e) {
    updateMessage = '';
  }
  return updateMessage;
}
