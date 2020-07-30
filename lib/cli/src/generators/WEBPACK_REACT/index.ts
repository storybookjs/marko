import { baseGenerator, Generator } from '../baseGenerator';
import { StoryFormat } from '../../project_types';
import { copyTemplate } from '../../helpers';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'react');
  if (options.storyFormat === StoryFormat.MDX) {
    copyTemplate(__dirname, StoryFormat.MDX);
  }
};

export default generator;
