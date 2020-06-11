import { NpmOptions } from '../NpmOptions';
import { StoryFormat } from '../project_types';
import { JsPackageManager } from '../js-package-manager';

export type GeneratorOptions = {
  storyFormat: StoryFormat;
};

export type Generator = (
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  options: GeneratorOptions
) => Promise<void>;
