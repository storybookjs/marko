import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'mithril');
};

export default generator;
