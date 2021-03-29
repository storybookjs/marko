import fse from 'fs-extra';
import { logger } from '@storybook/node-logger';

import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  let extraMain;
  let commonJs = false;
  // svelte.config.js ?
  if (fse.existsSync('./svelte.config.js')) {
    logger.info("Configuring preprocessor from 'svelte.config.js'");

    extraMain = {
      svelteOptions: { preprocess: '%%require("../svelte.config.js").preprocess%%' },
    };
  } else if (fse.existsSync('./svelte.config.cjs')) {
    logger.info("Configuring preprocessor from 'svelte.config.cjs'");

    commonJs = true;

    extraMain = {
      svelteOptions: { preprocess: '%%require("../svelte.config.cjs").preprocess%%' },
    };
  } else {
    // svelte-preprocess dependencies ?
    const packageJson = packageManager.retrievePackageJson();
    if (packageJson.devDependencies && packageJson.devDependencies['svelte-preprocess']) {
      logger.info("Configuring preprocessor with 'svelte-preprocess'");

      extraMain = {
        svelteOptions: { preprocess: '%%require("svelte-preprocess")()%%' },
      };
    }
  }

  await baseGenerator(packageManager, npmOptions, options, 'svelte', {
    extraPackages: ['svelte', 'svelte-loader'],
    extraAddons: ['@storybook/addon-svelte-csf'],
    extensions: ['js', 'jsx', 'ts', 'tsx', 'svelte'],
    extraMain,
    commonJs,
  });
};

export default generator;
