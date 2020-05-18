const path = require('path');
const config = require('../../jest.config');

const projectDir = path.resolve('../../');

module.exports = {
  preset: 'jest-preset-angular',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
    },
  },
  roots: [__dirname],
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.jsx?$': path.join(projectDir, 'scripts/babel-jest.js'),
    '^.+[/\\\\].storybook[/\\\\]config\\.ts$': path.join(projectDir, 'scripts/jest-ts-babel.js'),
    '^.+\\.(ts|js|html)$': 'ts-jest',
    '^.+\\.mdx$': '@storybook/addon-docs/jest-transform-mdx',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'html'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  setupFilesAfterEnv: ['./jest-config/setup.ts'],
};
