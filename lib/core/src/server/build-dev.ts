import fs from 'fs-extra';
import chalk from 'chalk';
import { logger, colors, instance as npmLog } from '@storybook/node-logger';
import fetch from 'node-fetch';
import Cache from 'file-system-cache';
import boxen from 'boxen';
import semver from '@storybook/semver';
import dedent from 'ts-dedent';
import Table from 'cli-table3';
import prettyTime from 'pretty-hrtime';
import prompts from 'prompts';
import detectFreePort from 'detect-port';

import { Stats } from 'webpack';
import { storybookDevServer } from './dev-server';
import { DevCliOptions, getDevCli } from './cli';
import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';
import { ReleaseNotesData, VersionCheck, PackageJson, LoadOptions } from './types';

const { STORYBOOK_VERSION_BASE = 'https://storybook.js.org' } = process.env;

const cache = Cache({
  basePath: resolvePathInStorybookCache('dev-server'),
  ns: 'storybook', // Optional. A grouping namespace for items.
});

const writeStats = async (name: string, stats: Stats) => {
  const filePath = resolvePathInStorybookCache(`public/${name}-stats.json`);
  await fs.writeFile(filePath, JSON.stringify(stats.toJson(), null, 2), 'utf8');
  return filePath;
};

const getFreePort = (port: number) =>
  detectFreePort(port).catch((error) => {
    logger.error(error);
    process.exit(-1);
  });

const updateCheck = async (version: string): Promise<VersionCheck> => {
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

// We only expect to have release notes available for major and minor releases.
// For this reason, we convert the actual version of the build here so that
// every place that relies on this data can reference the version of the
// release notes that we expect to use.
const getReleaseNotesVersion = (version: string): string => {
  const { major, minor } = semver.parse(version);
  const { version: releaseNotesVersion } = semver.coerce(`${major}.${minor}`);
  return releaseNotesVersion;
};

const getReleaseNotesFailedState = (version: string) => {
  return {
    success: false,
    currentVersion: getReleaseNotesVersion(version),
    showOnFirstLaunch: false,
  };
};

export const RELEASE_NOTES_CACHE_KEY = 'releaseNotesData';

export const getReleaseNotesData = async (
  currentVersionToParse: string,
  fileSystemCache: any
): Promise<ReleaseNotesData> => {
  let result;
  try {
    const fromCache = (await fileSystemCache.get('releaseNotesData', []).catch(() => {})) || [];
    const releaseNotesVersion = getReleaseNotesVersion(currentVersionToParse);
    const versionHasNotBeenSeen = !fromCache.includes(releaseNotesVersion);

    if (versionHasNotBeenSeen) {
      await fileSystemCache.set('releaseNotesData', [...fromCache, releaseNotesVersion]);
    }

    const sortedHistory = semver.sort(fromCache);
    const highestVersionSeenInThePast = sortedHistory.slice(-1)[0];

    let isUpgrading = false;
    let isMajorOrMinorDiff = false;

    if (highestVersionSeenInThePast) {
      isUpgrading = semver.gt(releaseNotesVersion, highestVersionSeenInThePast);
      const versionDiff = semver.diff(releaseNotesVersion, highestVersionSeenInThePast);
      isMajorOrMinorDiff = versionDiff === 'major' || versionDiff === 'minor';
    }

    result = {
      success: true,
      showOnFirstLaunch:
        versionHasNotBeenSeen &&
        // Only show the release notes if this is not the first time Storybook
        // has been built.
        !!highestVersionSeenInThePast &&
        isUpgrading &&
        isMajorOrMinorDiff,
      currentVersion: releaseNotesVersion,
    };
  } catch (e) {
    result = getReleaseNotesFailedState(currentVersionToParse);
  }
  return result;
};

function createUpdateMessage(updateInfo: VersionCheck, version: string): string {
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

function outputStartupInformation(options: {
  updateInfo: VersionCheck;
  version: string;
  address: string;
  networkAddress: string;
  managerTotalTime?: [number, number];
  previewTotalTime?: [number, number];
}) {
  const {
    updateInfo,
    version,
    address,
    networkAddress,
    managerTotalTime,
    previewTotalTime,
  } = options;

  const updateMessage = createUpdateMessage(updateInfo, version);

  const serveMessage = new Table({
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: '',
    },
    // @ts-ignore
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  });

  serveMessage.push(
    ['Local:', chalk.cyan(address)],
    ['On your network:', chalk.cyan(networkAddress)]
  );

  const timeStatement = [
    managerTotalTime && `${chalk.underline(prettyTime(managerTotalTime))} for manager`,
    previewTotalTime && `${chalk.underline(prettyTime(previewTotalTime))} for preview`,
  ]
    .filter(Boolean)
    .join(' and ');

  // eslint-disable-next-line no-console
  console.log(
    boxen(
      dedent`
          ${colors.green(`Storybook ${chalk.bold(version)} started`)}
          ${chalk.gray(timeStatement)}

          ${serveMessage.toString()}${updateMessage ? `\n\n${updateMessage}` : ''}
        `,
      { borderStyle: 'round', padding: 1, borderColor: '#F1618C' } as any
    )
  );
}

async function outputStats(previewStats: Stats, managerStats: Stats) {
  if (previewStats) {
    const filePath = await writeStats('preview', previewStats);
    logger.info(`=> preview stats written to ${chalk.cyan(filePath)}`);
  }
  if (managerStats) {
    const filePath = await writeStats('manager', managerStats);
    logger.info(`=> manager stats written to ${chalk.cyan(filePath)}`);
  }
}

export async function buildDevStandalone(
  options: DevCliOptions &
    LoadOptions & {
      packageJson: PackageJson;
      ignorePreview: boolean;
      docsMode: boolean;
      configDir: string;
      cache: any;
    }
) {
  try {
    const { packageJson, versionUpdates, releaseNotes } = options;
    const { version } = packageJson;

    // updateInfo and releaseNotesData are cached, so this is typically pretty fast
    const [port, updateInfo, releaseNotesData] = await Promise.all([
      getFreePort(options.port),
      versionUpdates
        ? updateCheck(version)
        : Promise.resolve({ success: false, data: {}, time: Date.now() }),
      releaseNotes
        ? getReleaseNotesData(version, cache)
        : Promise.resolve(getReleaseNotesFailedState(version)),
    ]);

    if (!options.ci && !options.smokeTest && options.port != null && port !== options.port) {
      const { shouldChangePort } = await prompts({
        type: 'confirm',
        initial: true,
        name: 'shouldChangePort',
        message: `Port ${options.port} is not available. Would you like to run Storybook on port ${port} instead?`,
      });
      if (!shouldChangePort) process.exit(1);
    }

    /* eslint-disable no-param-reassign */
    options.port = port;
    // @ts-ignore
    options.versionCheck = updateInfo;
    // @ts-ignore
    options.releaseNotesData = releaseNotesData;
    /* eslint-enable no-param-reassign */

    const {
      address,
      networkAddress,
      previewStats,
      managerStats,
      managerTotalTime,
      previewTotalTime,
    } = await storybookDevServer(options);

    if (options.smokeTest) {
      await outputStats(previewStats, managerStats);
      const hasManagerWarnings = managerStats && managerStats.toJson().warnings.length > 0;
      const hasPreviewWarnings = previewStats && previewStats.toJson().warnings.length > 0;
      process.exit(hasManagerWarnings || (hasPreviewWarnings && !options.ignorePreview) ? 1 : 0);
      return;
    }

    outputStartupInformation({
      updateInfo,
      version,
      address,
      networkAddress,
      managerTotalTime,
      previewTotalTime,
    });
  } catch (error) {
    // this is a weird bugfix, somehow 'node-pre-gyp' is polluting the npmLog header
    npmLog.heading = '';

    if (error instanceof Error) {
      if ((error as any).error) {
        logger.error((error as any).error);
      } else if ((error as any).stats && (error as any).stats.compilation.errors) {
        (error as any).stats.compilation.errors.forEach((e: any) => logger.plain(e));
      } else {
        logger.error(error as any);
      }
    }
    logger.line();
    logger.warn(
      error.close
        ? dedent`
            FATAL broken build!, will close the process,
            Fix the error below and restart storybook.
          `
        : dedent`
            Broken build, fix the error above.
            You may need to refresh the browser.
          `
    );
    logger.line();

    if (options.smokeTest || (error && error.close)) {
      process.exit(1);
    }
  }
}

export async function buildDev({
  packageJson,
  ...loadOptions
}: { packageJson: PackageJson } & LoadOptions) {
  const cliOptions = await getDevCli(packageJson);

  await buildDevStandalone({
    ...cliOptions,
    ...loadOptions,
    packageJson,
    configDir: (loadOptions as any).configDir || cliOptions.configDir || './.storybook',
    ignorePreview: !!cliOptions.previewUrl,
    docsMode: !!cliOptions.docs,
    cache,
  });
}
