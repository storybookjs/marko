import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'riot', {
    extraPackages: ['riot-tag-loader'],
  });
};

export default generator;
