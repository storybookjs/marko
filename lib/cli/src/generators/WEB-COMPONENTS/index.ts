import { baseGenerator, Generator } from '../baseGenerator';
import { copyTemplate } from '../../helpers';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'web-components', {
    extraPackages: ['lit-html'],
  });
  copyTemplate(__dirname, options.storyFormat);
};

export default generator;
