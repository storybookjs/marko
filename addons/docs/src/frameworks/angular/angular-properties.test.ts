import 'jest-specific-snapshot';
import path from 'path';
import fs from 'fs';
import tmp from 'tmp';
import { sync as spawnSync } from 'cross-spawn';

import { findComponentByName, extractArgTypesFromData } from './compodoc';

// File hierarchy: __testfixtures__ / some-test-case / input.*
const inputRegExp = /^input\..*$/;

const runCompodoc = (inputPath: string) => {
  const testDir = path.dirname(inputPath);
  const { name: tmpDir, removeCallback } = tmp.dirSync();

  // FIXME: for now, this requires a tsconfig.json for each test case. Tried generating
  // one dynamically in tmpDir, but compodoc doesn't handle absolute paths properly
  // (and screwed around with relative paths as well, but couldn't get it working)
  spawnSync('compodoc', ['-p', `${testDir}/tsconfig.json`, '-e', 'json', '-d', tmpDir], {
    stdio: 'inherit',
  });
  const output = fs.readFileSync(`${tmpDir}/documentation.json`, 'utf8');
  try {
    removeCallback();
  } catch (e) {
    //
  }
  return output;
};

describe('angular component properties', () => {
  const fixturesDir = path.join(__dirname, '__testfixtures__');
  fs.readdirSync(fixturesDir, { withFileTypes: true }).forEach((testEntry) => {
    if (testEntry.isDirectory()) {
      const testDir = path.join(fixturesDir, testEntry.name);
      const testFile = fs.readdirSync(testDir).find((fileName) => inputRegExp.test(fileName));
      if (testFile) {
        it(testEntry.name, () => {
          const inputPath = path.join(testDir, testFile);

          // snapshot the output of compodoc
          const compodocOutput = runCompodoc(inputPath);
          const compodocJson = JSON.parse(compodocOutput);
          expect(compodocJson).toMatchSpecificSnapshot(path.join(testDir, 'compodoc.snapshot'));

          // snapshot the output of addon-docs angular-properties
          const componentData = findComponentByName('InputComponent', compodocJson);
          const argTypes = extractArgTypesFromData(componentData);
          expect(argTypes).toMatchSpecificSnapshot(path.join(testDir, 'argtypes.snapshot'));
        });
      }
    }
  });
});
