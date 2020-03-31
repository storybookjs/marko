import 'jest-specific-snapshot';
import path from 'path';
import fs from 'fs';

import { transformFileSync, transformSync } from '@babel/core';
import requireFromString from 'require-from-string';

import { extractProps } from './extractProps';
import { normalizeNewlines } from '../../lib/utils';

// File hierarchy:
// __testfixtures__ / some-test-case / input.*
const inputRegExp = /^input\..*$/;

const transformToModule = (inputCode: string) => {
  const options = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            esmodules: true,
          },
        },
      ],
    ],
  };
  const { code } = transformSync(inputCode, options);
  return normalizeNewlines(code);
};

const annotateWithDocgen = (inputPath: string) => {
  const options = {
    presets: ['@babel/typescript', '@babel/react'],
    plugins: ['babel-plugin-react-docgen', '@babel/plugin-proposal-class-properties'],
    babelrc: false,
  };
  const { code } = transformFileSync(inputPath, options);
  return normalizeNewlines(code);
};

describe('react component properties', () => {
  const fixturesDir = path.join(__dirname, '__testfixtures__');
  fs.readdirSync(fixturesDir, { withFileTypes: true }).forEach((testEntry) => {
    if (testEntry.isDirectory()) {
      const testDir = path.join(fixturesDir, testEntry.name);
      const testFile = fs.readdirSync(testDir).find((fileName) => inputRegExp.test(fileName));
      if (testFile) {
        it(testEntry.name, () => {
          const inputPath = path.join(testDir, testFile);

          // snapshot the output of babel-plugin-react-docgen
          const docgenPretty = annotateWithDocgen(inputPath);
          expect(docgenPretty).toMatchSpecificSnapshot(path.join(testDir, 'docgen.snapshot'));

          // transform into an uglier format that's works with require-from-string
          const docgenModule = transformToModule(docgenPretty);

          // snapshot the output of component-properties/react
          const { component } = requireFromString(docgenModule);
          const properties = extractProps(component);
          expect(properties).toMatchSpecificSnapshot(path.join(testDir, 'properties.snapshot'));
        });
      }
    }
  });
});
