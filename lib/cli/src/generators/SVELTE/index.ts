import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'svelte', {
    extraPackages: ['svelte', 'svelte-loader'],
  });
};

export default generator;
