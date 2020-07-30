import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'svelte', {
    extraPackages: ['svelte', 'svelte-loader'],
  });
};

export default generator;
