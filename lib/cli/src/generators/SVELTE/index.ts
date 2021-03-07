import fse from 'fs-extra';
import { logger } from '@storybook/node-logger';

import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'svelte', {
    extraPackages: ['svelte', 'svelte-loader'],
    extraAddons: ['@storybook/addon-svelte-csf'],
  });

  let conf = fse.readFileSync('./.storybook/main.js').toString();

  // add *.stories.svelte
  conf = conf.replace(/js\|jsx/g, 'js|jsx|svelte');

  let requirePreprocessor;
  let preprocessStatement = 'undefined';

  // svelte.config.js ?
  if (fse.existsSync('./svelte.config.js')) {
    logger.info("Configuring preprocessor from 'svelte.config.js'");

    requirePreprocessor = `const preprocess = require("../svelte.config.js").preprocess;`;
    preprocessStatement = 'preprocess';
  } else {
    // svelte-preprocess dependencies ?
    const packageJson = packageManager.retrievePackageJson();
    if (packageJson.devDependencies && packageJson.devDependencies['svelte-preprocess']) {
      logger.info("Configuring preprocessor with 'svelte-preprocess'");

      requirePreprocessor = 'const sveltePreprocess = require("svelte-preprocess");';
      preprocessStatement = 'sveltePreprocess()';
    }
  }

  const svelteOptions = `  "svelteOptions": {\n    preprocess: ${preprocessStatement},\n  },`;

  if (requirePreprocessor) {
    conf = `${requirePreprocessor}\n\n${conf}`;
  }

  conf = conf.replace(/\],/, `],\n${svelteOptions}`);
  fse.writeFileSync('./.storybook/main.js', conf);
};

export default generator;
