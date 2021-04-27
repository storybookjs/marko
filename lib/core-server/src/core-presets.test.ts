import 'jest-specific-snapshot';
import path from 'path';
import { Configuration } from 'webpack';
import Cache from 'file-system-cache';
import { resolvePathInStorybookCache } from '@storybook/core-common';
import { executor as previewExecutor } from '@storybook/builder-webpack4';
import { executor as managerExecutor } from './manager/builder';

import { buildDevStandalone } from './build-dev';
import { buildStaticStandalone } from './build-static';

// nx-ignore-next-line
import reactOptions from '../../../app/react/src/server/options';
// nx-ignore-next-line
import vue3Options from '../../../app/vue3/src/server/options';
// nx-ignore-next-line
import htmlOptions from '../../../app/html/src/server/options';
// nx-ignore-next-line
import webComponentsOptions from '../../../app/web-components/src/server/options';
import { outputStats } from './utils/output-stats';

// this only applies to this file
jest.setTimeout(10000);

jest.mock('@storybook/builder-webpack5', () => {
  const actualBuilder = jest.requireActual('@storybook/builder-webpack5');
  // MUTATION! we couldn't mock webpack5, so we added a level of indirection instead
  actualBuilder.executor.get = jest.fn();
  return actualBuilder;
});

jest.mock('@storybook/builder-webpack4', () => {
  const actualBuilder = jest.requireActual('@storybook/builder-webpack4');
  // MUTATION! we couldn't mock webpack5, so we added a level of indirection instead
  actualBuilder.executor.get = jest.fn();
  return actualBuilder;
});

jest.mock('./manager/builder', () => {
  const actualBuilder = jest.requireActual('./manager/builder');
  // MUTATION!
  actualBuilder.executor.get = jest.fn();
  return actualBuilder;
});

jest.mock('cpy', () => () => Promise.resolve());
jest.mock('http', () => ({
  ...jest.requireActual('http'),
  createServer: () => ({ listen: (_options, cb) => cb() }),
}));
jest.mock('@storybook/node-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('./utils/output-startup-information', () => ({
  outputStartupInformation: jest.fn(),
}));

jest.mock('./utils/output-stats');

const cache = Cache({
  basePath: resolvePathInStorybookCache('dev-server'),
  ns: 'storybook-test', // Optional. A grouping namespace for items.
});

const managerOnly = false;
const baseOptions = {
  ignorePreview: managerOnly,
  // FIXME: this should just be ignorePreview everywhere
  managerOnly, // production
  docsMode: false,
  cache,
  configDir: path.resolve(`${__dirname}/../../../examples/react-ts`),
  outputDir: `${__dirname}/storybook-static`, // production
  ci: true,
  managerCache: false,
};

const ROOT = process.cwd();
const NODE_MODULES = /.*node_modules/g;
const cleanRoots = (obj): any => {
  if (!obj) return obj;
  if (typeof obj === 'string')
    return obj.replace(ROOT, 'ROOT').replace(NODE_MODULES, 'NODE_MODULES');
  if (Array.isArray(obj)) return obj.map(cleanRoots);
  if (obj instanceof RegExp) return cleanRoots(obj.toString());
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => {
        if (key === 'version' && typeof val === 'string') {
          return [key, '*'];
        }
        return [key, cleanRoots(val)];
      })
    );
  }
  return obj;
};

const getConfig = (fn: any, name): Configuration | null => {
  const call = fn.mock.calls.find((c) => c[0].name === name);
  if (!call) return null;
  return call[0];
};

const prepareSnap = (fn: any, name): Pick<Configuration, 'module' | 'entry' | 'plugins'> => {
  const config = getConfig(fn, name);
  if (!config) return null;

  const keys = Object.keys(config);
  const { module, entry, plugins } = config;

  return cleanRoots({ keys, module, entry, plugins: plugins.map((p) => p.constructor.name) });
};

const snap = (name: string) => `__snapshots__/${name}`;

describe.each([
  ['cra-ts-essentials', reactOptions],
  ['vue-3-cli', vue3Options],
  ['web-components-kitchen-sink', webComponentsOptions],
  ['html-kitchen-sink', htmlOptions],
])('%s', (example, frameworkOptions) => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  const options = {
    ...baseOptions,
    ...frameworkOptions,
    configDir: path.resolve(`${__dirname}/../../../examples/${example}/.storybook`),
  };

  describe('manager', () => {
    it('dev mode', async () => {
      await buildDevStandalone({ ...options, ignorePreview: true });

      const managerConfig = prepareSnap(managerExecutor.get, 'manager');
      expect(managerConfig).toMatchSpecificSnapshot(snap(`${example}_manager-dev`));
    });
    it('production mode', async () => {
      await buildStaticStandalone({ ...options, ignorePreview: true });

      const managerConfig = prepareSnap(managerExecutor.get, 'manager');
      expect(managerConfig).toMatchSpecificSnapshot(snap(`${example}_manager-prod`));
    });
  });

  describe('preview', () => {
    it('dev mode', async () => {
      await buildDevStandalone({ ...options, managerCache: true });

      const previewConfig = prepareSnap(previewExecutor.get, 'preview');
      expect(previewConfig).toMatchSpecificSnapshot(snap(`${example}_preview-dev`));
    });
    it('production mode', async () => {
      await buildStaticStandalone({ ...options, managerCache: true });

      const previewConfig = prepareSnap(previewExecutor.get, 'preview');
      expect(previewConfig).toMatchSpecificSnapshot(snap(`${example}_preview-prod`));
    });
  });
});

const progressPlugin = (config) =>
  config.plugins.find((p) => p.constructor.name === 'ProgressPlugin');

describe('dev cli flags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  const cliOptions = { ...reactOptions, ...baseOptions };

  it('baseline', async () => {
    await buildDevStandalone(cliOptions);
    const config = getConfig(previewExecutor.get, 'preview');
    expect(progressPlugin(config)).toBeTruthy();
  });

  it('--quiet', async () => {
    const options = { ...cliOptions, quiet: true };
    await buildDevStandalone(options);
    const config = getConfig(previewExecutor.get, 'preview');
    expect(progressPlugin(config)).toBeFalsy();
  });

  it('--webpack-stats-json calls output-stats', async () => {
    await buildDevStandalone(cliOptions);
    expect(outputStats).not.toHaveBeenCalled();

    await buildDevStandalone({ ...cliOptions, webpackStatsJson: '/tmp/dir' });
    expect(outputStats).toHaveBeenCalledWith(
      '/tmp/dir',
      expect.objectContaining({ toJson: expect.any(Function) }),
      expect.objectContaining({ toJson: expect.any(Function) })
    );
  });

  describe.each([
    ['root directory /', '/', "Won't remove directory '/'. Check your outputDir!"],
    ['empty string ""', '', "Won't remove current directory. Check your outputDir!"],
  ])('Invalid outputDir must throw: %s', (_, outputDir, expectedErrorMessage) => {
    const optionsWithInvalidDir = {
      ...cliOptions,
      outputDir,
    };

    it('production mode', async () => {
      expect.assertions(1);
      await expect(buildStaticStandalone(optionsWithInvalidDir)).rejects.toThrow(
        expectedErrorMessage
      );
    });
  });

  describe('Invalid staticDir must throw: root directory /', () => {
    const optionsWithInvalidStaticDir = {
      ...cliOptions,
      staticDir: ['/'],
    };

    it('production mode', async () => {
      expect.assertions(1);
      await expect(buildStaticStandalone(optionsWithInvalidStaticDir)).rejects.toThrow(
        "Won't copy root directory. Check your staticDirs!"
      );
    });
  });
});

describe('build cli flags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });
  const cliOptions = { ...reactOptions, ...baseOptions };

  it('--webpack-stats-json calls output-stats', async () => {
    await buildStaticStandalone(cliOptions);
    expect(outputStats).not.toHaveBeenCalled();

    await buildStaticStandalone({ ...cliOptions, webpackStatsJson: '/tmp/dir' });
    expect(outputStats).toHaveBeenCalledWith(
      '/tmp/dir',
      expect.objectContaining({ toJson: expect.any(Function) }),
      expect.objectContaining({ toJson: expect.any(Function) })
    );
  });
});
