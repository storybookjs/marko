import ReactDocgenTypescriptPlugin from 'react-docgen-typescript-plugin';
import type { TypescriptConfig } from '@storybook/core-common';
import * as preset from './framework-preset-react-docgen';

describe('framework-preset-react-docgen', () => {
  const babelPluginReactDocgenPath = require.resolve('babel-plugin-react-docgen');

  it('should return the babel config with the extra plugin', async () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    };

    const config = await preset.babel(babelConfig, {
      presets: {
        // @ts-ignore
        apply: async () =>
          ({
            check: false,
            reactDocgen: 'react-docgen',
          } as TypescriptConfig),
      },
    } as any);

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

  it('should return the webpack config with the extra plugin', async () => {
    const webpackConfig = {
      plugins: [],
    };

    const config = await preset.webpackFinal(webpackConfig, {
      presets: {
        // @ts-ignore
        apply: async () =>
          ({
            check: false,
            reactDocgen: 'react-docgen-typescript',
          } as TypescriptConfig),
      },
    });

    expect(config).toEqual({
      plugins: [expect.any(ReactDocgenTypescriptPlugin)],
    });
  });

  it('should not add any extra plugins', async () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    };

    const webpackConfig = {
      plugins: [],
    };

    const outputBabelconfig = await preset.babel(babelConfig, {
      presets: {
        // @ts-ignore
        apply: async () =>
          ({
            check: false,
            reactDocgen: false,
          } as TypescriptConfig),
      },
    });
    const outputWebpackconfig = await preset.webpackFinal(webpackConfig, {
      presets: {
        // @ts-ignore
        apply: async () =>
          ({
            check: false,
            reactDocgen: false,
          } as TypescriptConfig),
      },
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
