import 'jest-specific-snapshot';
import path from 'path';
import fs from 'fs';
import tmp from 'tmp';
import { sync as spawnSync } from 'cross-spawn';

// File hierarchy:
// __testfixtures__ / some-test-case / input.*
const inputRegExp = /^input\..*$/;

const runWebComponentsAnalyzer = (inputPath: string) => {
  const { name: tmpDir, removeCallback } = tmp.dirSync();
  const customElementsFile = `${tmpDir}/custom-elements.json`;
  spawnSync('wca', ['analyze', inputPath, '--outFile', customElementsFile], {
    stdio: 'inherit',
  });
  const output = fs.readFileSync(customElementsFile, 'utf8');
  try {
    removeCallback();
  } catch (e) {
    //
  }
  return output;
};

describe('web-components component properties', () => {
  // we need to mock lit-html and dynamically require custom-elements
  // because lit-html is distributed as ESM not CJS
  // https://github.com/Polymer/lit-html/issues/516
  jest.mock('lit-html', () => {});
  // eslint-disable-next-line global-require
  const { extractArgTypesFromElements } = require('./custom-elements');

  const fixturesDir = path.join(__dirname, '__testfixtures__');
  fs.readdirSync(fixturesDir, { withFileTypes: true }).forEach((testEntry) => {
    if (testEntry.isDirectory()) {
      const testDir = path.join(fixturesDir, testEntry.name);
      const testFile = fs.readdirSync(testDir).find((fileName) => inputRegExp.test(fileName));
      if (testFile) {
        it(testEntry.name, () => {
          const inputPath = path.join(testDir, testFile);

          // snapshot the output of wca
          const customElementsJson = runWebComponentsAnalyzer(inputPath);
          const customElements = JSON.parse(customElementsJson);
          customElements.tags.forEach((tag: any) => {
            // eslint-disable-next-line no-param-reassign
            tag.path = 'dummy-path-to-component';
          });
          expect(customElements).toMatchSpecificSnapshot(
            path.join(testDir, 'custom-elements.snapshot')
          );

          // snapshot the properties
          const properties = extractArgTypesFromElements('input', customElements);
          expect(properties).toMatchSpecificSnapshot(path.join(testDir, 'properties.snapshot'));
        });
      }
    }
  });
});
