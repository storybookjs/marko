import path from 'path';
import { TransformOptions } from '@babel/core';
import { Configuration } from 'webpack';

export function babelDefault(config: TransformOptions) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'],
    ],
  };
}

export function webpackFinal(config: Configuration) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      modules: [path.resolve('node_modules'), ...config.resolve.modules],
      alias: {
        ...config.resolve.alias,
        react: require.resolve('preact/compat'),
        'react-dom/test-utils': require.resolve('preact/test-utils'),
        'react-dom': require.resolve('preact/compat'),
      },
    },
  };
}
