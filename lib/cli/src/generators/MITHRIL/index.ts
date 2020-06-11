import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'mithril');
};

export default generator;
