import { includePaths, excludePaths } from '../config/utils';
import { useBaseTsSupport } from '../config/useBaseTsSupport';

export default (options, framework) => ({
  test: useBaseTsSupport(framework) ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
  use: [
    {
      loader: 'babel-loader',
      options,
    },
  ],
  include: includePaths,
  exclude: excludePaths,
});
