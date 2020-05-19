import * as preset from './framework-preset-react-docgen';

describe('framework-preset-react-docgen', () => {
  const babelPluginReactDocgenPath = require.resolve('babel-plugin-react-docgen');

  it('should return the config with the extra plugin', () => {
    const babelConfig = {
      babelrc: false,
      presets: ['env', 'foo-preset'],
      plugins: ['foo-plugin'],
    };

    const config = preset.babel(babelConfig, {
      typescriptOptions: { check: false, reactDocgen: 'react-docgen' },
    });

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
});
