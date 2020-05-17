import { NpmOptions } from '../NpmOptions';
import { StoryFormat } from '../project_types';

export type GeneratorOptions = {
  storyFormat: StoryFormat;
};

export type Generator = (npmOptions: NpmOptions, options: GeneratorOptions) => Promise<void>;
