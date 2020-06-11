import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'preact');
};

export default generator;
