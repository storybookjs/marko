/* eslint-disable jest/no-interpolation-in-snapshots */
import { Configuration } from 'webpack';
import { logger } from '@storybook/node-logger';
import { webpackFinal } from './framework-preset-angular-cli';

// eslint-disable-next-line global-require, jest/no-mocks-import
jest.spyOn(logger, 'error').mockImplementation();
jest.spyOn(logger, 'info').mockImplementation();

const testCwd = process.cwd();
const cwdSpy = jest.spyOn(process, 'cwd');

let cwd = process.cwd();

const initMockWorkspace = (name: string) => {
  cwdSpy.mockReturnValue(`${testCwd}/src/server/__mocks-ng-workspace__/${name}`);
  cwd = process.cwd();
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('framework-preset-angular-cli', () => {
  describe('without angular.json', () => {
    it('should return webpack base config and display log error', () => {
      const webpackBaseConfig = newWebpackConfiguration();

      const config = webpackFinal(webpackBaseConfig);

      expect(logger.info).toHaveBeenCalledWith('=> Loading angular-cli config.');
      expect(logger.error).toHaveBeenCalledWith(
        `Could not find angular.json using ${cwd}/angular.json`
      );

      expect(config).toEqual(webpackBaseConfig);
    });
  });

  describe("when angular.json haven't projects entry", () => {
    beforeEach(() => {
      initMockWorkspace('without-projects-entry');
    });
    it('throws error', () => {
      expect(() => webpackFinal(newWebpackConfiguration())).toThrowError(
        'angular.json must have projects entry.'
      );
    });
  });

  describe('when angular.json have empty projects entry', () => {
    beforeEach(() => {
      initMockWorkspace('empty-projects-entry');
    });
    it('throws error', () => {
      expect(() => webpackFinal(newWebpackConfiguration())).toThrowError(
        'angular.json must have projects entry.'
      );
    });
  });

  describe('when angular.json have projects without architect.build', () => {
    beforeEach(() => {
      initMockWorkspace('without-architect-build');
    });

    it('throws error', () => {
      expect(() => webpackFinal(newWebpackConfiguration())).toThrowError(
        "Cannot read property 'build' of undefined"
      );
    });
  });
  describe('when angular.json have projects without architect.build.options.assets', () => {
    beforeEach(() => {
      initMockWorkspace('without-architect-build-options-assets');
    });
    it('throws error', () => {
      expect(() => webpackFinal(newWebpackConfiguration())).toThrowError(
        "Cannot read property 'assets' of undefined"
      );
    });
  });
  describe('when angular.json have minimal config', () => {
    beforeEach(() => {
      initMockWorkspace('minimal-config');
    });
    it('should log', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      webpackFinal(baseWebpackConfig);

      expect(logger.info).toHaveBeenCalledTimes(3);
      expect(logger.info).toHaveBeenNthCalledWith(
        1,
        "=> Using angular project 'foo-project' for configuring Storybook."
      );
      expect(logger.info).toHaveBeenNthCalledWith(2, '=> Loading angular-cli config.');
      expect(logger.info).toHaveBeenNthCalledWith(3, '=> Get angular-cli webpack config.');
    });

    it('should extends webpack base config', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = webpackFinal(baseWebpackConfig);

      expect(webpackFinalConfig).toEqual({
        ...baseWebpackConfig,
        module: { ...baseWebpackConfig.module, rules: expect.anything() },
        plugins: expect.anything(),
        resolve: {
          ...baseWebpackConfig.resolve,
          modules: expect.arrayContaining(baseWebpackConfig.resolve.modules),
          // the base resolve.plugins are not kept 🤷‍♂️
          plugins: expect.not.arrayContaining(baseWebpackConfig.resolve.plugins),
        },
        resolveLoader: expect.anything(),
      });
    });

    it('should set webpack "module.rules"', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = webpackFinal(baseWebpackConfig);

      expect(webpackFinalConfig.module.rules).toEqual([
        {
          exclude: [],
          test: /\.css$/,
          use: expect.anything(),
        },
        {
          exclude: [],
          test: /\.scss$|\.sass$/,
          use: expect.anything(),
        },
        {
          exclude: [],
          test: /\.less$/,
          use: expect.anything(),
        },
        {
          exclude: [],
          test: /\.styl$/,
          use: expect.anything(),
        },
        ...baseWebpackConfig.module.rules,
      ]);
    });

    it('should set webpack "plugins"', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = webpackFinal(baseWebpackConfig);

      expect(webpackFinalConfig.plugins).toMatchInlineSnapshot(`
        Array [
          AnyComponentStyleBudgetChecker {
            "budgets": Array [],
          },
          ContextReplacementPlugin {
            "newContentRecursive": undefined,
            "newContentRegExp": undefined,
            "newContentResource": undefined,
            "resourceRegExp": /\\\\@angular\\(\\\\\\\\\\|\\\\/\\)core\\(\\\\\\\\\\|\\\\/\\)/,
          },
          DedupeModuleResolvePlugin {
            "modules": Map {},
            "options": Object {
              "verbose": undefined,
            },
          },
          Object {
            "keepBasePlugin": true,
          },
        ]
      `);
    });

    it('should set webpack "resolve.modules"', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = webpackFinal(baseWebpackConfig);

      expect(webpackFinalConfig.resolve.modules).toEqual([
        ...baseWebpackConfig.resolve.modules,
        `${cwd}/src`,
      ]);
    });

    it('should replace webpack "resolve.plugins"', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = webpackFinal(baseWebpackConfig);

      expect(webpackFinalConfig.resolve.plugins).toMatchInlineSnapshot(`
        Array [
          TsconfigPathsPlugin {
            "absoluteBaseUrl": "${cwd}/src/",
            "baseUrl": "./",
            "extensions": Array [
              ".ts",
              ".tsx",
            ],
            "log": Object {
              "log": [Function],
              "logError": [Function],
              "logInfo": [Function],
              "logWarning": [Function],
            },
            "matchPath": [Function],
            "source": "described-resolve",
            "target": "resolve",
          },
        ]
      `);
    });
  });
  describe('when angular.json have "options.styles" config', () => {
    beforeEach(() => {
      initMockWorkspace('with-options-styles');
    });

    it('should extends webpack base config', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = webpackFinal(baseWebpackConfig);

      expect(webpackFinalConfig).toEqual({
        ...baseWebpackConfig,
        entry: [
          ...(baseWebpackConfig.entry as any[]),
          `${cwd}/src/styles.css`,
          `${cwd}/src/styles.scss`,
        ],
        module: { ...baseWebpackConfig.module, rules: expect.anything() },
        plugins: expect.anything(),
        resolve: {
          ...baseWebpackConfig.resolve,
          modules: expect.arrayContaining(baseWebpackConfig.resolve.modules),
          // the base resolve.plugins are not kept 🤷‍♂️
          plugins: expect.not.arrayContaining(baseWebpackConfig.resolve.plugins),
        },
        resolveLoader: expect.anything(),
      });
    });

    it('should set webpack "module.rules"', () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = webpackFinal(baseWebpackConfig);

      expect(webpackFinalConfig.module.rules).toEqual([
        {
          exclude: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.css$/,
          use: expect.anything(),
        },
        {
          exclude: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.scss$|\.sass$/,
          use: expect.anything(),
        },
        {
          exclude: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.less$/,
          use: expect.anything(),
        },
        {
          exclude: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.styl$/,
          use: expect.anything(),
        },
        {
          include: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.css$/,
          use: expect.anything(),
        },
        {
          include: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.scss$|\.sass$/,
          use: expect.anything(),
        },
        {
          include: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.less$/,
          use: expect.anything(),
        },
        {
          include: [`${cwd}/src/styles.css`, `${cwd}/src/styles.scss`],
          test: /\.styl$/,
          use: expect.anything(),
        },
        ...baseWebpackConfig.module.rules,
      ]);
    });
  });
});

const newWebpackConfiguration = (
  transformer: (c: Configuration) => Configuration = (c) => c
): Configuration => {
  return transformer({
    name: 'preview',
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: [
      '/Users/joe/storybook/lib/core-server/dist/cjs/globals/polyfills.js',
      '/Users/joe/storybook/lib/core-server/dist/cjs/globals/globals.js',
      '/Users/joe/storybook/examples/angular-cli/.storybook/storybook-init-framework-entry.js',
      '/Users/joe/storybook/addons/docs/dist/esm/frameworks/common/config.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/docs/dist/esm/frameworks/angular/config.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/actions/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/actions/dist/esm/preset/addArgs.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/links/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/knobs/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/backgrounds/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/backgrounds/dist/esm/preset/addParameter.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/a11y/dist/esm/a11yRunner.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/a11y/dist/esm/a11yHighlight.js-generated-other-entry.js',
      '/Users/joe/storybook/examples/angular-cli/.storybook/preview.ts-generated-config-entry.js',
      '/Users/joe/storybook/examples/angular-cli/.storybook/generated-stories-entry.js',
      '/Users/joe/storybook/node_modules/webpack-hot-middleware/client.js?reload=true&quiet=false&noInfo=undefined',
    ],
    output: {
      path: '/Users/joe/storybook/examples/angular-cli/node_modules/.cache/storybook/public',
      filename: '[name].[hash].bundle.js',
      publicPath: '',
    },
    plugins: [{ keepBasePlugin: true } as any],
    module: {
      rules: [{ keepBaseRule: true } as any],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.cjs'],
      modules: ['node_modules'],
      mainFields: ['browser', 'main'],
      alias: {
        '@emotion/core': '/Users/joe/storybook/node_modules/@emotion/core',
        '@emotion/styled': '/Users/joe/storybook/node_modules/@emotion/styled',
        'emotion-theming': '/Users/joe/storybook/node_modules/emotion-theming',
        '@storybook/addons': '/Users/joe/storybook/lib/addons',
        '@storybook/api': '/Users/joe/storybook/lib/api',
        '@storybook/channels': '/Users/joe/storybook/lib/channels',
        '@storybook/channel-postmessage': '/Users/joe/storybook/lib/channel-postmessage',
        '@storybook/components': '/Users/joe/storybook/lib/components',
        '@storybook/core-events': '/Users/joe/storybook/lib/core-events',
        '@storybook/router': '/Users/joe/storybook/lib/router',
        '@storybook/theming': '/Users/joe/storybook/lib/theming',
        '@storybook/semver': '/Users/joe/storybook/node_modules/@storybook/semver',
        '@storybook/client-api': '/Users/joe/storybook/lib/client-api',
        '@storybook/client-logger': '/Users/joe/storybook/lib/client-logger',
        react: '/Users/joe/storybook/node_modules/react',
        'react-dom': '/Users/joe/storybook/node_modules/react-dom',
      },
      plugins: [{ keepBasePlugin: true } as any],
    },
    resolveLoader: { plugins: [] },
    optimization: {
      splitChunks: { chunks: 'all' },
      runtimeChunk: true,
      sideEffects: true,
      usedExports: true,
      concatenateModules: true,
      minimizer: [],
    },
    performance: { hints: false },
  });
};
