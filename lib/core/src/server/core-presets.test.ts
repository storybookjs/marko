import 'jest-specific-snapshot';
import path from 'path';
import webpack, { Configuration } from 'webpack';
import Cache from 'file-system-cache';

import { buildDevStandalone } from './build-dev';
import { buildStaticStandalone } from './build-static';
import { resolvePathInStorybookCache } from './utils/resolve-path-in-sb-cache';
import reactOptions from '../../../../app/react/src/server/options';

const TIMEOUT = 10000;

const mockStats = {
  hasErrors: () => false,
  hasWarnings: () => false,
  toJson: () => ({ warnings: [], errors: [] }),
};
const webpackStub = (cb) => {
  return cb(null, mockStats);
};
const middlewareStub = (_req, _resp, next) => next();
middlewareStub.waitUntilValid = (cb) => cb(mockStats);
jest.mock('webpack-hot-middleware', () => () => middlewareStub);
jest.mock('webpack-dev-middleware', () => () => middlewareStub);
jest.mock('webpack', () => {
  const actualWebpack = jest.requireActual('webpack');
  return {
    __esModule: true, // this property makes it work
    default: jest.fn((...args) => {
      const compiler = actualWebpack(...args);
      compiler.watch = jest.fn(webpackStub);
      compiler.run = jest.fn(webpackStub);
      return compiler;
    }),
    ...actualWebpack,
  };
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
  configDir: path.resolve(`${__dirname}/../../../../examples/react-ts`),
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

describe('manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });
  it(
    'dev mode',
    async () => {
      const result = await buildDevStandalone(options);
      expect(webpack).toHaveBeenCalled();

      const managerConfig = prepareSnap(webpack, 'manager');
      expect(managerConfig).toMatchSpecificSnapshot(snap('manager-dev'));
    },
    TIMEOUT
  );
  it(
    'production mode',
    async () => {
      const result = await buildStaticStandalone(options);
      expect(webpack).toHaveBeenCalled();

      const managerConfig = prepareSnap(webpack, 'manager');
      expect(managerConfig).toMatchSpecificSnapshot(snap('manager-prod'));
    },
    TIMEOUT
  );
});

describe('preview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });
  it(
    'dev mode',
    async () => {
      const result = await buildDevStandalone(options);
      expect(webpack).toHaveBeenCalled();

      const previewConfig = prepareSnap(webpack, 'preview');
      expect(previewConfig).toMatchSpecificSnapshot(snap('preview-dev'));
    },
    TIMEOUT
  );
  it(
    'production mode',
    async () => {
      const result = await buildStaticStandalone(options);
      expect(webpack).toHaveBeenCalled();

      const previewConfig = prepareSnap(webpack, 'preview');
      expect(previewConfig).toMatchSpecificSnapshot(snap('preview-prod'));
    },
    TIMEOUT
  );
});
