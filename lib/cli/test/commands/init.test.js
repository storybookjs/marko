const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const run = require('../helpers');

const fixturesDirPath = path.join(__dirname, '..', 'fixtures');
const runDirPath = path.join(__dirname, '..', 'run');

const rootPath = path.join(__dirname, '..', '..', '..', '..');

beforeAll(() => {
  fse.removeSync(runDirPath);
  fse.mkdirSync(runDirPath);
  // Copy all files from fixtures directory to `run`
  const dirs = fs.readdirSync(fixturesDirPath);
  dirs.forEach((dir) => {
    const src = path.join(fixturesDirPath, dir);
    const dest = path.join(runDirPath, path.basename(src));
    fse.copySync(src, dest);
  });
});

afterAll(() => {
  fse.removeSync(runDirPath);
});

describe('sb init', () => {
  it('starts storybook without errors', () => {
    const dirs = fs.readdirSync(runDirPath);
    dirs.forEach((dir) => {
      run(['init', '--skip-install', 'yes'], { cwd: path.join(runDirPath, dir) });
    });

    // Install all the dependencies in a single run
    console.log('Running bootstrap');
    run(
      ['yarn', 'install', '--non-interactive', '--silent', '--pure-lockfile'],
      { cwd: rootPath },
      false
    );

    // Check that storybook starts without errors
    dirs.forEach((dir) => {
      console.log(`Running smoke test in ${dir}`);
      const { status } = run(
        ['yarn', 'storybook', '--smoke-test', '--quiet'],
        { cwd: path.join(runDirPath, dir) },
        false
      );
      expect(status).toBe(0);
    });
  });
});
