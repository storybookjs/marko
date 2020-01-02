import 'jest-specific-snapshot';
import path from 'path';
import fs from 'fs-extra';
import { compileCsfModule } from '.';

const inputRegExp = /\.json$/;

async function generate(filePath: string) {
  const content = await fs.readFile(filePath, 'utf8');
  return compileCsfModule(JSON.parse(content));
}

describe('json-to-csf-compiler', () => {
  const transformFixturesDir = path.join(__dirname, '__testfixtures__');
  fs.readdirSync(transformFixturesDir)
    .filter((fileName: string) => inputRegExp.test(fileName))
    .forEach((fixtureFile: string) => {
      it(fixtureFile, async () => {
        const inputPath = path.join(transformFixturesDir, fixtureFile);
        const code = await generate(inputPath);
        expect(code).toMatchSpecificSnapshot(inputPath.replace(inputRegExp, '.snapshot'));
      });
    });
});
