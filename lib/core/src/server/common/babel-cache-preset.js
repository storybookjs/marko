import { resolvePathInStorybookCache } from '../utils/resolve-path-in-sb-cache';

const extend = (babelConfig) => ({
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables a cache directory for faster-rebuilds
  cacheDirectory: resolvePathInStorybookCache('babel'),
  ...babelConfig,
});

export { extend as babel, extend as managerBabel };
