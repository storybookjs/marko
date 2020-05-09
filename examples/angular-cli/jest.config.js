const config = require('../../jest.config');

module.exports = {
  preset: 'jest-preset-angular',
  ...config,
  globals: {
    __TRANSFORM_HTML__: true,
    'ts-jest': {
      tsConfigFile: '<rootDir>/examples/angular-cli/src/tsconfig.spec.json',
    },
  },
  roots: [__dirname],
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.jsx?$': '<rootDir>/scripts/utils/jest-transform-js.js',
    '^.+[/\\\\].storybook[/\\\\]config\\.ts$': '<rootDir>/scripts/utils/jest-transform-ts.js',
    '^.+\\.html$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
    '^.+\\.ts$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
    '^.+\\.mdx$': '@storybook/addon-docs/jest-transform-mdx',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'html'],
};
