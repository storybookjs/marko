const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const run = require('../helpers');

const fixturesDirPath = path.join(__dirname, '..', 'fixtures');
const runDirPath = path.join(__dirname, '..', 'run');

const rootPath = path.join(__dirname, '..', '..', '..', '..');
const dirs = fs.readdirSync(fixturesDirPath);

beforeAll(() => {
  fse.removeSync(runDirPath);
  fse.mkdirSync(runDirPath);

  // Copy all files from fixtures directory to `run`
  dirs.forEach((dir) => {
    const src = path.join(fixturesDirPath, dir);
    const dest = path.join(runDirPath, path.basename(src));
    fse.copySync(src, dest);

    // Initialize Storybook
    run(['init', '--skip-install', 'yes'], { cwd: dest });

    // Install all the dependencies in a single run
    run(
      ['yarn', 'install', '--non-interactive', '--silent', '--pure-lockfile'],
      { cwd: rootPath },
      false
    );
  });
});

afterAll(() => {
  fse.removeSync(runDirPath);
});

describe('sb init', () => {
  it.each(dirs)('starts storybook in smoke-test mode for: %s', (dir) => {
    // Check that storybook starts without errors
    const { status } = run(
      ['yarn', 'storybook', '--smoke-test', '--quiet'],
      { cwd: path.join(runDirPath, dir), stdio: 'inherit' },
      false
    );
    expect(status).toBe(0);
  });
});
