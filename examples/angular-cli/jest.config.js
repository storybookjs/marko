const config = require('../../jest.config');

module.exports = {
  preset: 'jest-preset-angular',
  ...config,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/examples/angular-cli/src/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
    },
  },
  roots: [__dirname],
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+[/\\\\].storybook[/\\\\]config\\.ts$': '<rootDir>/scripts/utils/jest-transform-ts.js',
    '^.+\\.(ts|js|html)$': 'ts-jest',
    '^.+\\.jsx?$': '<rootDir>/scripts/utils/jest-transform-js.js',
    '^.+\\.mdx$': '@storybook/addon-docs/jest-transform-mdx',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'html'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
