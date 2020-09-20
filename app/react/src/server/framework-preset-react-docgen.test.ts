import ReactDocgenTypescriptPlugin from 'react-docgen-typescript-plugin';
import * as preset from './framework-preset-react-docgen';
import type { StorybookOptions } from './types';

describe('framework-preset-react-docgen', () => {
  const babelPluginReactDocgenPath = require.resolve('babel-plugin-react-docgen');

  it('should return the babel config with the extra plugin', () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    };

    const config = preset.babel(babelConfig, {
      typescriptOptions: { check: false, reactDocgen: 'react-docgen' },
    } as StorybookOptions);

    expect(config).toEqual({
      babelrc: false,
      plugins: ['foo-plugin'],
      presets: ['env', 'foo-preset'],
      overrides: [
        {
          test: /\.(mjs|tsx?|jsx?)$/,
          plugins: [
            [
              babelPluginReactDocgenPath,
              {
                DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
              },
            ],
          ],
        },
      ],
    });
  });

  it('should return the webpack config with the extra plugin', () => {
    const webpackConfig = {
      plugins: [],
    };

    const config = preset.webpackFinal(webpackConfig, {
      typescriptOptions: { check: false, reactDocgen: 'react-docgen-typescript' },
    });

    expect(config).toEqual({
      plugins: [expect.any(ReactDocgenTypescriptPlugin)],
    });
  });

  it('should not add any extra plugins', () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    };

    const webpackConfig = {
      plugins: [],
    };

    const outputBabelconfig = preset.babel(babelConfig, {
      typescriptOptions: { check: false, reactDocgen: false },
    });
    const outputWebpackconfig = preset.webpackFinal(webpackConfig, {
      typescriptOptions: { check: false, reactDocgen: false },
    });

    expect(outputBabelconfig).toEqual({
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    });
    expect(outputWebpackconfig).toEqual({
      plugins: [],
    });
  });
});
