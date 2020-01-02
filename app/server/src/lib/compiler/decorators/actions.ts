import { StorybookSection, StorybookStory } from '../types';
import { importMeta } from './utils';
import { stringifyObject } from '../stringifier';

type Action = string | any;

function stringifyActionsDecorator(actions: Action[], importName: string): string[] {
  if (!actions || actions.length === 0) return [];

  const actionArgs = actions.map(action => stringifyObject(action, 2)).join(',\n    ');

  return [`${importName}(${actionArgs})`];
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

export default function actionsDecorator(section: StorybookSection): StorybookSection {
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
