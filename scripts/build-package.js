#!/usr/bin/env node

/* eslint-disable global-require */
const { resolve } = require('path');
const { checkDependenciesAndRun, spawn } = require('./cli-utils');

const getStorybookPackages = () => {
  const listCommand = spawn(`lerna list`, {
    stdio: 'pipe',
  });

  const packages = listCommand.output
    .toString()
    .match(/@storybook\/(.)*/g)
    .sort();

  return packages;
};

function run() {
  const inquirer = require('inquirer');
  const program = require('commander');
  const chalk = require('chalk');
  const log = require('npmlog');

  log.heading = 'storybook';
  const prefix = 'build';
  log.addLevel('aborted', 3001, { fg: 'red', bold: true });

  const packages = getStorybookPackages();
  const packageTasks = packages
    .map((package) => {
      return {
        name: package,
        suffix: package.replace('@storybook/', ''),
        defaultValue: false,
        option: `--${package}`,
        helpText: `build only the ${package} package`,
      };
    })
    .reduce((acc, next) => {
      acc[next.name] = next;
      return acc;
    }, {});

  const tasks = {
    watch: {
      name: `watch`,
      defaultValue: false,
      option: '--watch',
      helpText: 'build on watch mode',
    },
    ...packageTasks,
  };

  const groups = {
    'mode (leave unselected if you just want to build)': ['watch'],
    packages,
  };

  const main = program.version('5.0.0').option('--all', `build everything ${chalk.gray('(all)')}`);

  Object.keys(tasks)
    .reduce((acc, key) => acc.option(tasks[key].option, tasks[key].helpText), main)
    .parse(process.argv);

  Object.keys(tasks).forEach((key) => {
    const formattedKey = tasks[key].option
      .replace('--', '')
      // converts text like --@storybook/addon-docs to @storybook/addonDocs
      // which is how the option is parsed in the process
      .replace(/-./g, (str) => str.toUpperCase()[1]);
    // checks if a flag is passed e.g. yarn build --@storybook/addon-docs --watch
    tasks[key].value = program[formattedKey] || program.all;
  });

  const createSeparator = (input) => `- ${input}${' ---------'.substr(0, 12)}`;

  const choices = Object.values(groups)
    .map((l) =>
      l.map((key) => ({
        name: (tasks[key] && tasks[key].name) || key,
        checked: (tasks[key] && tasks[key].defaultValue) || false,
      }))
    )
    .reduce(
      (acc, i, k) =>
        acc.concat(new inquirer.Separator(createSeparator(Object.keys(groups)[k]))).concat(i),
      []
    );

  let selection;
  let watchMode = false;
  if (
    !Object.keys(tasks)
      .map((key) => tasks[key].value)
      .filter(Boolean).length
  ) {
    const ui = new inquirer.ui.BottomBar();
    ui.log.write(
      chalk.yellow(
        'You can also run `yarn build --packagename` directly or `yarn build --all` for all packages!'
      )
    );

    selection = inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select the packages to build',
          name: 'todo',
          pageSize: Object.keys(tasks).length + 2,
          choices,
        },
      ])
      .then(({ todo }) => {
        watchMode = todo.includes('watch');
        return todo
          .filter((name) => name !== 'watch') // remove watch option as it served its purpose
          .map((name) => tasks[Object.keys(tasks).find((i) => tasks[i].name === name)]);
      });
  } else {
    // hits here when running yarn build --packagename
    watchMode = process.argv.includes('--watch');

    selection = Promise.resolve(
      Object.keys(tasks)
        .map((key) => tasks[key])
        .filter((item) => item.value === true)
    );
  }

  selection
    .then((list) => {
      if (list.length === 0) {
        log.warn(prefix, 'Nothing to build!');
      } else {
        const packageNames = list
          .map((key) => key.suffix)
          // filters out watch command if --watch is used
          .filter(Boolean);

        const glob =
          packageNames.length > 1
            ? `@storybook/{${packageNames.join(',')}}`
            : `@storybook/${packageNames[0]}`;

        if (watchMode) {
          const runWatchMode = () => {
            const baseWatchCommand = `lerna exec --scope "${glob}" -- cross-env-shell node ${resolve(
              __dirname
            )}`;
            const watchTsc = `${baseWatchCommand}/watch-tsc.js`;
            const watchBabel = `${baseWatchCommand}/watch-babel.js`;
            const command = `concurrently --kill-others "${watchTsc}" "${watchBabel}"`;
            spawn(command);
          };

          if (packageNames.length < 5) {
            runWatchMode();
          } else {
            inquirer
              .prompt([
                {
                  type: 'confirm',
                  message:
                    'You selected a lot of packages on watch mode. This is a very expensive action and might slow your computer down. Do you want to continue?',
                  name: 'confirmation',
                },
              ])
              .then(({ confirmation }) => {
                if (confirmation === true) {
                  runWatchMode();
                }
              });
          }
        } else {
          spawn(`lerna run prepare --scope "${glob}"`);
        }
        process.stdout.write('\x07');
      }
    })
    .catch((e) => {
      log.aborted(prefix, chalk.red(e.message));
      log.silly(prefix, e);
      process.exit(1);
    });
}

checkDependenciesAndRun(run);
