#!/usr/bin/env node

const { spawn } = require('child_process');
const { promisify } = require('util');
const {
  readdir: readdirRaw,
  readFile: readFileRaw,
  writeFile: writeFileRaw,
  statSync,
  readFileSync,
} = require('fs');
const { join } = require('path');

const readdir = promisify(readdirRaw);
const writeFile = promisify(writeFileRaw);

const p = (l) => join(__dirname, '..', ...l);
const logger = console;

const exec = async (command, args = [], options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: 'inherit', shell: true });

    child
      .on('close', (code) => {
        if (code) {
          reject();
        } else {
          resolve();
        }
      })
      .on('error', (e) => {
        logger.error(e);
        reject();
      });
  });

const getDeployables = (files) => {
  return files.filter((f) => {
    const packageJsonLocation = p(['examples', f, 'package.json']);
    let stats = null;
    try {
      stats = statSync(packageJsonLocation);
    } catch (e) {
      // the folder had no package.json, we'll ignore
    }

    return stats && stats.isFile() && hasChromaticAppCode(packageJsonLocation);
  });
};

const hasChromaticAppCode = (l) => {
  const text = readFileSync(l, 'utf8');
  const json = JSON.parse(text);

  return !!(json && json.storybook && json.storybook.chromatic && json.storybook.chromatic.appCode);
};

const handleExamples = async (deployables) => {
  await deployables.reduce(async (acc, d) => {
    await acc;

    const out = p(['built-storybooks', d]);
    const cwd = p([]);
    const {
      storybook: {
        chromatic: { appCode },
      },
    } = JSON.parse(readFileSync(p(['examples', d, 'package.json'])));

    if (appCode) {
      await exec(
        `yarn`,
        [
          'chromatic',
          `--storybook-build-dir="${out}"`,
          '--exit-zero-on-changes',
          `--app-code="${appCode}"`,
        ],
        { cwd }
      );

      logger.log('-------');
      logger.log(`✅ ${d} ran`);
      logger.log('-------');
    } else {
      logger.log('-------');
      logger.log(`❌ ${d} skipped`);
      logger.log('-------');
    }
  }, Promise.resolve());
};

const run = async () => {
  const examples = await readdir(p(['examples']));

  const { length } = examples;
  const [a, b] = [process.env.CIRCLE_NODE_INDEX || 0, process.env.CIRCLE_NODE_TOTAL || 1];
  const step = Math.ceil(length / b);
  const offset = step * a;

  const list = examples.slice().splice(offset, step);
  const deployables = getDeployables(list);

  if (deployables.length) {
    logger.log(`will build: ${deployables.join(', ')}`);
    await handleExamples(deployables);
  }

  if (
    deployables.length &&
    (process.env.CIRCLE_NODE_INDEX === undefined ||
      process.env.CIRCLE_NODE_INDEX === '0' ||
      process.env.CIRCLE_NODE_INDEX === 0)
  ) {
    logger.log('-------');
    logger.log('✅ done');
    logger.log('-------');
  }
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});
