import {
  CompileCsfModuleArgs,
  CompileStorybookSectionArgs,
  CompileStorybookStoryArgs,
  StorybookSection,
  StorybookStory,
} from './types';

import { stringifySection } from './stringifier';

function createStory(storyArgs: CompileStorybookStoryArgs): StorybookStory {
  const { name, ...options } = storyArgs;

  return {
    name,
    storyFn: '(args) => {}',
    ...options,
  };
}

function createSection(args: CompileStorybookSectionArgs): StorybookSection {
  const { title, stories, ...options } = args;
  return {
    imports: {},
    decorators: [],
    title,
    stories: stories.map((storyArgs) => createStory(storyArgs)),
    ...options,
  };
}

export function compileCsfModule(args: CompileCsfModuleArgs): string {
  return stringifySection(createSection(args));
}
