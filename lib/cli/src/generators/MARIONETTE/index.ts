import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'marionette');
};

export default generator;
