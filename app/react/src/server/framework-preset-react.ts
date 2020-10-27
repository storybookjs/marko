import path from 'path';
import { TransformOptions } from '@babel/core';

const storybookReactDirName = path.dirname(require.resolve('@storybook/react/package.json'));
// TODO: improve node_modules detection
const context = storybookReactDirName.includes('node_modules')
  ? path.join(storybookReactDirName, '../../') // Real life case, already in node_modules
  : path.join(storybookReactDirName, '../../node_modules'); // SB Monorepo

const hasJsxRuntime = () => {
  try {
    require.resolve('react/jsx-runtime', { paths: [context] });
    return true;
  } catch (e) {
    return false;
  }
};

export function babelDefault(config: TransformOptions) {
  const presetReactOptions = hasJsxRuntime() ? { runtime: 'automatic' } : {};
  return {
    ...config,
    presets: [
      ...config.presets,
      [require.resolve('@babel/preset-react'), presetReactOptions],
      require.resolve('@babel/preset-flow'),
    ],
    plugins: [...(config.plugins || []), require.resolve('babel-plugin-add-react-displayname')],
  };
}
