/* eslint-disable no-irregular-whitespace */
import path from 'path';
import { remove, ensureDir, pathExists, writeFile, writeJSON } from 'fs-extra';
import { prompt } from 'enquirer';
import pLimit from 'p-limit';

import program from 'commander';
import { serve } from './utils/serve';
import { exec } from './utils/command';
// @ts-ignore
import { filterDataForCurrentCircleCINode } from './utils/concurrency';

import * as configs from './run-e2e-config';

const logger = console;

export interface Parameters {
  /** E2E configuration name */
  name: string;
  /** framework version */
  version: string;
  /** CLI to bootstrap the project */
  generator: string;
  /** Use storybook framework detection */
  autoDetect?: boolean;
  /** Pre-build hook */
  preBuildCommand?: string;
  /** When cli complains when folder already exists */
  ensureDir?: boolean;
  /** Dependencies to add before building Storybook */
  additionalDeps?: string[];
  /** Add typescript dependency and creates a tsconfig.json file */
  typescript?: boolean;
}

export interface Options extends Parameters {
  cwd?: string;
}

const rootDir = path.join(__dirname, '..');
const siblingDir = path.join(__dirname, '..', '..', 'storybook-e2e-testing');

const prepareDirectory = async ({
  cwd,
  ensureDir: ensureDirOption = true,
}: Options): Promise<boolean> => {
  const siblingExists = await pathExists(siblingDir);

  if (!siblingExists) {
    await ensureDir(siblingDir);
  }

  await exec('git init', { cwd: siblingDir });
  await exec('npm init -y', { cwd: siblingDir });
  await writeFile(path.join(siblingDir, '.gitignore'), 'node_modules\n');

  const cwdExists = await pathExists(cwd);

  if (cwdExists) {
    return true;
  }

  if (ensureDirOption) {
    await ensureDir(cwd);
  }

  return false;
};

const cleanDirectory = async ({ cwd }: Options): Promise<void> => {
  await remove(cwd);
  await remove(path.join(siblingDir, 'node_modules'));
  await remove(path.join(siblingDir, 'package.json'));
  await remove(path.join(siblingDir, 'yarn.lock'));
  await remove(path.join(siblingDir, '.yarnrc.yml'));
  await remove(path.join(siblingDir, '.yarn'));
};

const installYarn2 = async ({ cwd }: Options) => {
  const commands = [`yarn set version berry`, `yarn config set enableGlobalCache true`];

  if (!useYarn2Pnp) {
    commands.push('yarn config set nodeLinker node-modules');
  }

  const command = commands.join(' && ');

  logger.info(`🧶 Installing Yarn 2`);
  logger.debug(command);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`🚨 Installing Yarn 2 failed`);
    throw e;
  }
};

const configureYarn2 = async ({ cwd }: Options) => {
  const commands = [
    // Create file to ensure yarn will be ok to set some config in the current directory and not in the parent
    `touch yarn.lock`,
    // ⚠️ Need to set registry because Yarn 2 is not using the conf of Yarn 1
    `yarn config set npmScopes --json '{ "storybook": { "npmRegistryServer": "http://localhost:6000/" } }'`,
    // Some required magic to be able to fetch deps from local registry
    `yarn config set unsafeHttpWhitelist --json '["localhost"]'`,
    // Disable fallback mode to make sure everything is required correctly
    `yarn config set pnpFallbackMode none`,
    `yarn config set enableGlobalCache true`,
    // We need to be able to update lockfile when bootstrapping the examples
    `yarn config set enableImmutableInstalls false`,
    // Add package extensions
    // https://github.com/facebook/create-react-app/pull/9872
    `yarn config set "packageExtensions.react-scripts@*.peerDependencies.react" "*"`,
    `yarn config set "packageExtensions.react-scripts@*.dependencies.@pmmmwh/react-refresh-webpack-plugin" "*"`,
  ];

  if (!useYarn2Pnp) {
    commands.push('yarn config set nodeLinker node-modules');
  }

  const command = commands.join(' && ');
  logger.info(`🎛 Configuring Yarn 2`);
  logger.debug(command);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`🚨 Configuring Yarn 2 failed`);
    throw e;
  }
};

const generate = async ({ cwd, name, version, generator }: Options) => {
  let command = generator.replace(/{{name}}/g, name).replace(/{{version}}/g, version);
  if (useYarn2Pnp) {
    command = command.replace(/npx/g, `yarn dlx`);
  }

  logger.info(`🏗  Bootstrapping ${name} project`);
  logger.debug(command);

  try {
    await exec(command, { cwd });
  } catch (e) {
    logger.error(`🚨 Bootstrapping ${name} failed`);
    throw e;
  }
};

const initStorybook = async ({ cwd, autoDetect = true, name }: Options) => {
  logger.info(`🎨 Initializing Storybook with @storybook/cli`);
  try {
    const type = autoDetect ? '' : `--type ${name}`;

    const sbCLICommand = useLocalSbCli
      ? 'node ../../storybook/lib/cli/dist/esm/generate'
      : 'yarn dlx -p @storybook/cli sb';

    await exec(`${sbCLICommand} init --yes ${type}`, { cwd });
  } catch (e) {
    logger.error(`🚨 Storybook initialization failed`);
    throw e;
  }
};

const addRequiredDeps = async ({ cwd, additionalDeps }: Options) => {
  logger.info(`🌍 Adding needed deps & installing all deps`);
  try {
    if (additionalDeps && additionalDeps.length > 0) {
      await exec(`yarn add -D ${additionalDeps.join(' ')}`, {
        cwd,
      });
    } else {
      await exec(`yarn install`, {
        cwd,
      });
    }
  } catch (e) {
    logger.error(`🚨 Dependencies installation failed`);
    throw e;
  }
};

const addTypescript = async ({ cwd }: Options) => {
  logger.info(`👮🏻 Adding typescript and tsconfig.json`);
  try {
    await exec(`yarn add -D typescript@latest`, { cwd });
    const tsConfig = {
      compilerOptions: {
        baseUrl: '.',
        esModuleInterop: true,
        jsx: 'preserve',
        skipLibCheck: true,
        strict: true,
      },
      include: ['src/*'],
    };
    const tsConfigJsonPath = path.resolve(cwd, 'tsconfig.json');
    await writeJSON(tsConfigJsonPath, tsConfig, { encoding: 'utf8', spaces: 2 });
  } catch (e) {
    logger.error(`🚨 Creating tsconfig.json failed`);
    throw e;
  }
};

const buildStorybook = async ({ cwd, preBuildCommand }: Options) => {
  logger.info(`👷 Building Storybook`);
  try {
    if (preBuildCommand) {
      await exec(preBuildCommand, { cwd });
    }
    await exec(`yarn build-storybook --quiet`, { cwd });
  } catch (e) {
    logger.error(`🚨 Storybook build failed`);
    throw e;
  }
};

const serveStorybook = async ({ cwd }: Options, port: string) => {
  const staticDirectory = path.join(cwd, 'storybook-static');
  logger.info(`🌍 Serving ${staticDirectory} on http://localhost:${port}`);

  return serve(staticDirectory, port);
};

const runCypress = async ({ name, version }: Options, location: string, open: boolean) => {
  const cypressCommand = open ? 'open' : 'run';
  logger.info(`🤖 Running Cypress tests`);
  try {
    await exec(
      `yarn cypress ${cypressCommand} --config integrationFolder="cypress/generated" --env location="${location}"`,
      { cwd: rootDir }
    );
    logger.info(`✅ E2E tests success`);
    logger.info(`🎉 Storybook is working great with ${name} ${version}!`);
  } catch (e) {
    logger.error(`🚨 E2E tests fails`);
    logger.info(`🥺 Storybook has some issues with ${name} ${version}!`);
    throw e;
  }
};

const runTests = async ({ name, version, ...rest }: Parameters) => {
  const options = {
    name,
    version,
    ...rest,
    cwd: path.join(siblingDir, `${name}-${version}`),
  };

  logger.log();
  logger.info(`🏃‍♀️ Starting for ${name} ${version}`);
  logger.log();
  logger.debug(options);
  logger.log();

  if (!(await prepareDirectory(options))) {
    // We need to install Yarn 2 to be able to bootstrap the different apps used
    // for the tests with `yarn dlx`
    await installYarn2({ ...options, cwd: siblingDir });

    await generate({ ...options, cwd: siblingDir });
    logger.log();

    // Configure Yarn 2 in the bootstrapped project to make it use the local
    // verdaccio registry
    await configureYarn2(options);

    if (options.typescript) {
      await addTypescript(options);
      logger.log();
    }

    await addRequiredDeps(options);
    logger.log();

    await initStorybook(options);
    logger.log();

    await buildStorybook(options);
    logger.log();
  }

  const server = await serveStorybook(options, '4000');
  logger.log();

  let open = false;
  if (!process.env.CI) {
    ({ open } = await prompt({
      type: 'confirm',
      name: 'open',
      message: 'Should open cypress?',
    }));
  }

  try {
    await runCypress(options, 'http://localhost:4000', open);
    logger.log();
  } finally {
    server.close();
  }
};

// Run tests!
const runE2E = async (parameters: Parameters) => {
  const { name, version } = parameters;
  const cwd = path.join(siblingDir, `${name}-${version}`);
  if (startWithCleanSlate) {
    logger.log();
    logger.info(`♻️  Starting with a clean slate, removing existing ${name} folder`);
    await cleanDirectory({ ...parameters, cwd });
  }

  return runTests(parameters)
    .then(async () => {
      if (!process.env.CI) {
        const { cleanup } = await prompt<{ cleanup: boolean }>({
          type: 'confirm',
          name: 'cleanup',
          message: 'Should perform cleanup?',
        });

        if (cleanup) {
          logger.log();
          logger.info(`🗑  Cleaning ${cwd}`);
          await cleanDirectory({ ...parameters, cwd });
        } else {
          logger.log();
          logger.info(`🚯 No cleanup happened: ${cwd}`);
        }
      }
    })
    .catch((e) => {
      logger.error(`🛑 an error occurred:\n${e}`);
      logger.log();
      logger.error(e);
      logger.log();
      process.exitCode = 1;
    });
};

program.option('--clean', 'Clean up existing projects before running the tests', false);
program.option('--use-yarn-2-pnp', 'Run tests using Yarn 2 PnP instead of Yarn 1 + npx', false);
program.option(
  '--use-local-sb-cli',
  'Run tests using local @storybook/cli package (⚠️ Be sure @storybook/cli is properly build as it will not be rebuild before running the tests)',
  false
);
program.option(
  '--skip <value>',
  'Skip a framework, can be used multiple times "--skip angular@latest --skip preact"',
  (value, previous) => previous.concat([value]),
  []
);
program.parse(process.argv);

const {
  useYarn2Pnp,
  useLocalSbCli,
  clean: startWithCleanSlate,
  args: frameworkArgs,
  skip: frameworksToSkip,
} = program;

const typedConfigs: { [key: string]: Parameters } = configs;
const e2eConfigs: { [key: string]: Parameters } = {};

if (frameworkArgs.length > 0) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [framework, version = 'latest'] of frameworkArgs.map((arg) => arg.split('@'))) {
    e2eConfigs[`${framework}-${version}`] = Object.values(typedConfigs).find(
      (c) => c.name === framework && c.version === version
    );
  }
} else {
  Object.values(typedConfigs).forEach((config) => {
    e2eConfigs[`${config.name}-${config.version}`] = config;
  });

  // CRA Bench is a special case of E2E tests, it requires Node 12 as `@storybook/bench` is using `@hapi/hapi@19.2.0`
  // which itself need Node 12.
  delete e2eConfigs['cra_bench-latest'];
}

if (frameworksToSkip.length > 0) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [framework, version = 'latest'] of frameworksToSkip.map((arg: string) =>
    arg.split('@')
  )) {
    delete e2eConfigs[`${framework}-${version}`];
  }
}

const perform = () => {
  const limit = pLimit(1);
  const narrowedConfigs = Object.values(e2eConfigs);
  const list = filterDataForCurrentCircleCINode(narrowedConfigs) as Parameters[];

  logger.info(`📑 Will run E2E tests for:${list.map((c) => `${c.name}@${c.version}`).join(', ')}`);

  return Promise.all(list.map((config) => limit(() => runE2E(config))));
};

perform().then(() => {
  process.exit(process.exitCode || 0);
});
