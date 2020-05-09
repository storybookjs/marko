import { spawn } from 'child_process';
import { promisify } from 'util';

import { readdir as readdirRaw, readFileSync } from 'fs';
import { join } from 'path';

import { getDeployables } from './utils/list-examples';

const readdir = promisify(readdirRaw);

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

const hasChromaticAppCode = (l) => {
  const text = readFileSync(l, 'utf8');
  const json = JSON.parse(text);

  return !!(
    json &&
    json.storybook &&
    json.storybook.chromatic &&
    json.storybook.chromatic.projectToken
  );
};

const handleExamples = async (deployables) => {
  await deployables.reduce(async (acc, d) => {
    await acc;

    const out = p(['built-storybooks', d]);
    const cwd = p([]);
    const {
      storybook: {
        chromatic: { projectToken },
      },
    } = JSON.parse(readFileSync(p(['examples', d, 'package.json'])));

    if (projectToken) {
      await exec(
        `yarn`,
        [
          'chromatic',
          `--storybook-build-dir="${out}"`,
          '--exit-zero-on-changes',
          `--project-token="${projectToken}"`,
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
  const deployables = getDeployables(list, hasChromaticAppCode);

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
