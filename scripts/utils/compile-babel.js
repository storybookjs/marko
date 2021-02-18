/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

function getCommand(watch, dir) {
  // Compile angular with tsc
  if (process.cwd().includes(path.join('app', 'angular'))) {
    return '';
  }
  if (process.cwd().includes(path.join('addons', 'storyshots'))) {
    return '';
  }

  const babel = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'babel');

  const args = [
    './src',
    `--out-dir ${dir}`,
    `--config-file ${path.resolve(__dirname, '../../.babelrc.js')}`,
    `--copy-files`,
  ];

  /*
   * angular needs to be compiled with tsc; a compilation with babel is possible but throws
   * runtime errors because of the the babel decorators plugin
   * Only transpile .js and let tsc do the job for .ts files
   */
  if (process.cwd().includes(path.join('addons', 'storyshots'))) {
    args.push(`--extensions ".js"`);
  } else {
    args.push(`--extensions ".js,.jsx,.ts,.tsx"`);
  }

  if (watch) {
    args.push('-w');
  }

  return `${babel} ${args.join(' ')}`;
}

function handleExit(code, stderr, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback(stderr);
    }

    shell.exit(code);
  }
}

async function run({ watch, dir, silent, errorCallback }) {
  return new Promise((resolve, reject) => {
    const command = getCommand(watch, dir);

    if (command !== '') {
      const child = shell.exec(command, {
        async: true,
        silent,
        env: { ...process.env, BABEL_ESM: dir.includes('esm') },
      });
      let stderr = '';

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.stdout.on('data', (data) => {
        console.log(data);
      });

      child.on('exit', (code) => {
        resolve();
        handleExit(code, stderr, errorCallback);
      });
    } else {
      resolve();
    }
  });
}

async function babelify(options = {}) {
  const { watch = false, silent = true, modules, errorCallback } = options;

  if (!fs.existsSync('src')) {
    if (!silent) {
      console.log('No src dir');
    }
    return;
  }

  if (watch) {
    await Promise.all([
      run({ watch, dir: './dist/cjs', silent, errorCallback }),
      modules ? run({ watch, dir: './dist/esm', silent, errorCallback }) : Promise.resolve(),
    ]);
  } else {
    // cjs
    await run({ dir: './dist/cjs', silent, errorCallback });

    if (modules) {
      // esm
      await run({ dir: './dist/esm', silent, errorCallback });
    }
  }
}

module.exports = {
  babelify,
};
