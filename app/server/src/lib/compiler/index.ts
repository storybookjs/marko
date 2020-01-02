import {
  CompileCsfModuleArgs,
  CompileStorybookSectionArgs,
  CompileStorybookStoryArgs,
  StorybookSection,
  StorybookStory,
} from './types';

import stringifier from './stringifier';
import decorate from './decorators';

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

export default function compileCsfModule(args: CompileCsfModuleArgs): string {
  const { addons = [], ...compileSectionArgs } = args;
  const storybookSection = createSection(compileSectionArgs);
  const decoratedSection = decorate(storybookSection, addons);
  return stringifier(decoratedSection);
}
