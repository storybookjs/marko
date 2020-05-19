const path = require('path');
const config = require('../../jest.config');

const projectDir = path.join(__dirname, '../../');

module.exports = {
  preset: 'jest-preset-angular',
  globals: {
    'ts-jest': {
      tsConfig: path.join(__dirname, 'src/tsconfig.spec.json'),
      stringifyContentPathRegex: '\\.html$',
    },
  },
  roots: [__dirname],
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.(ts|html)$': 'ts-jest',
    '^.+\\.jsx?$': path.join(projectDir, 'scripts/utils/jest-transform-js.js'),
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
