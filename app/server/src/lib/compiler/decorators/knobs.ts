import dedent from 'ts-dedent';
import { StorybookSection, StorybookStory } from '../types';
import { decorateSimpleAddon, importMeta } from './utils';
import { stringifyObject } from '../stringifier';

type KnobType = 'text' | 'number' | 'color' | 'array' | 'boolean' | 'object' | 'date' | 'select';

interface StoryKnob {
  param: string;
  type: KnobType;
  name: string;
  value: any;
  [x: string]: any;
}

function stringifyKnob(knob: StoryKnob) {
  const { param, type, name, value, ...opts } = knob;
  const knobParam = param || name; // Todo: can we do away with this?
  const level = 2;
  const stringifiedValue = stringifyObject(value, level);
  // TODO: Add group
  const knobFunction = (t => {
    switch (t) {
      case 'text':
        return `text('${name}', ${stringifiedValue})`;
      case 'number':
        return `number('${name}', ${stringifiedValue}, ${stringifyObject(opts, level)})`;
      case 'color':
        return `color('${name}', ${stringifiedValue})`;
      case 'array':
        return `array('${name}', ${stringifiedValue}).join(',')`;
      case 'boolean':
        return `boolean('${name}', ${stringifiedValue})`;
      case 'object':
        return `object('${name}', ${stringifiedValue})`;
      case 'date':
        return `date('${name}', new Date(${stringifiedValue}))`;
      case 'select':
        return `select('${name}', ${stringifyObject(opts.options, level)}, ${stringifiedValue})`;
      default:
        return '';
    }
  })(type);

  return `${knobParam}: ${knobFunction}`;
}

function stringifyStoryFunction(knobs: StoryKnob[], storyFn: string) {
  if (!knobs || knobs.length === 0) return storyFn;

  return dedent`
    () => {
      return {
        ${knobs.map((knob: any) => `${stringifyKnob(knob)},`).join('\n    ')}
      };
    }
  `;
}

function knobsStoryDecorator(story: StorybookStory): StorybookStory {
  const { name, storyFn, knobs, ...options } = story;

  return {
    name,
    storyFn: stringifyStoryFunction(knobs, storyFn),
    ...options,
  };
}

export function knobsDecorator(section: StorybookSection): StorybookSection {
  const { title, imports, decorators, stories, ...options } = decorateSimpleAddon(section, 'knobs');
  const { importName, moduleName } = importMeta('knobs');

  const knobImports = [
    importName,
    'array',
    'boolean',
    'color',
    'date',
    'text',
    'number',
    'object',
    'select',
  ];

  return {
    title,
    imports: { ...imports, ...{ [moduleName]: knobImports } },
    decorators,
    stories: stories.map(story => knobsStoryDecorator(story)),
    ...options,
  };
}
