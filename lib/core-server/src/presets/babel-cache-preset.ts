import { resolvePathInStorybookCache } from '@storybook/core-common';

// FIXME: babelConfig is maybe a TransformOptions?
const extend = (babelConfig: any) => ({
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables a cache directory for faster-rebuilds
  cacheDirectory: resolvePathInStorybookCache('babel'),
  ...babelConfig,
});

export const babel = extend;
export const managerBabel = extend;
