import { StorybookSection, StorybookStory } from '../types';
import { importMeta } from './utils';
import { stringifyObject } from '../stringifier';

type Action = string | any;

function stringifyActionsDecorator(actions: Action[], importName: string): string[] {
  if (!actions || actions.length === 0) return [];

  const actionArgs = stringifyObject(actions, 2, true);
  return [`${importName}(\n      ${actionArgs}\n    )`];
}

function actionsStoryDecorator(story: StorybookStory, importName: string): StorybookStory {
  const { name, storyFn, decorators = [], actions, ...options } = story;

  return {
    name,
    storyFn,
    decorators: [...decorators, ...stringifyActionsDecorator(actions, importName)],
    ...options,
  };
}

export function actionsDecorator(section: StorybookSection): StorybookSection {
  const { title, imports, decorators, stories, ...options } = section;
  const { importName, moduleName } = importMeta('actions');

  return {
    title,
    imports: { ...imports, ...{ [moduleName]: [importName] } },
    decorators,
    stories: stories.map(story => actionsStoryDecorator(story, importName)),
    ...options,
  };
}
