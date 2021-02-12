import 'jest-specific-snapshot';
import path from 'path';
import { Configuration } from 'webpack';
import Cache from 'file-system-cache';
import { resolvePathInStorybookCache } from '@storybook/core-common';
import { executor as previewExecutor } from '@storybook/builder-webpack4';
import { executor as managerExecutor } from './manager/builder';

import { buildDevStandalone } from './build-dev';
import { buildStaticStandalone } from './build-static';

import reactOptions from '../../../app/react/src/server/options';

const TIMEOUT = 10000;

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

jest.mock('http', () => ({
  ...jest.requireActual('http'),
  createServer: () => ({ listen: (_options, cb) => cb() }),
}));

const cache = Cache({
  basePath: resolvePathInStorybookCache('dev-server'),
  ns: 'storybook-test', // Optional. A grouping namespace for items.
});

const managerOnly = false;
const options = {
  ...reactOptions,
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
        return [key, cleanRoots(val)];
      })
    );
  }
  return obj;
};

const prepareSnap = (fn: any, name): Pick<Configuration, 'module' | 'entry' | 'plugins'> => {
  const call = fn.mock.calls.find((c) => c[0].name === name);
  if (!call) return null;
  const { module, entry, plugins } = call[0];

  return cleanRoots({ module, entry, plugins: plugins.map((p) => p.constructor.name) });
};

const snap = (name: string) => `__snapshots__/${name}`;

describe('core presets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });
  it(
    'dev mode',
    async () => {
      const result = await buildDevStandalone(options);

      // const managerConfig = prepareSnap(managerExecutor.get, 'manager');
      // expect(managerConfig).toMatchSpecificSnapshot(snap('manager-dev'));

      const previewConfig = prepareSnap(previewExecutor.get, 'preview');
      expect(previewConfig).toMatchSpecificSnapshot(snap('preview-dev'));
    },
    TIMEOUT
  );
  // it.skip(
  //   'production mode',
  //   async () => {
  //     const result = await buildStaticStandalone(options);

  //     const managerConfig = prepareSnap(executor, 'manager');
  //     expect(managerConfig).toMatchSpecificSnapshot(snap('manager-prod'));

  //     const previewConfig = prepareSnap(executor, 'preview');
  //     expect(previewConfig).toMatchSpecificSnapshot(snap('preview-prod'));
  //   },
  //   TIMEOUT
  // );
});
