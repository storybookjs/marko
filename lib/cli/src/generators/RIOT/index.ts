import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'riot', {
    extraPackages: ['riot-tag-loader'],
  });
};

export default generator;
