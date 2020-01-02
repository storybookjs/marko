import {
  CompileCsfModuleArgs,
  CompileStorybookSectionArgs,
  CompileStorybookStoryArgs,
  StorybookSection,
  StorybookStory,
} from './types';

import { stringifySection } from './stringifier';
import { decorateSection } from './decorators';

function createStory(storyArgs: CompileStorybookStoryArgs): StorybookStory {
  const { name, ...options } = storyArgs;

  return {
    name,
    storyFn: '() => {}',
    ...options,
  };
}

function createSection(args: CompileStorybookSectionArgs): StorybookSection {
  const { title, stories, ...options } = args;
  return {
    imports: {},
    decorators: [],
    title,
    stories: stories.map(storyArgs => createStory(storyArgs)),
    ...options,
  };
}

export function compileCsfModule(args: CompileCsfModuleArgs): string {
  const { addons = [], ...compileSectionArgs } = args;
  const storybookSection = createSection(compileSectionArgs);
  const decoratedSection = decorateSection(storybookSection, addons);
  return stringifySection(decoratedSection);
}
