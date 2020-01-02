import { StorybookSection, Decorator } from '../types';
import { decorateSimpleAddon } from './utils';
import knobsDecorator from './knobs';
import actionsDecorator from './actions';

export function a11yDecorator(section: StorybookSection): StorybookSection {
  return decorateSimpleAddon(section, 'a11y');
}

export function linksDecorator(section: StorybookSection): StorybookSection {
  return decorateSimpleAddon(section, 'links');
}

// Order matters. We need to do knobs before actions to get the right StoryFn wrapping
const allDecorators: Record<string, Decorator> = {
  a11y: a11yDecorator,
  links: linksDecorator,
  knobs: knobsDecorator,
  actions: actionsDecorator,
};

export default function decorateSection(
  section: StorybookSection,
  addons: string[]
): StorybookSection {
  const decorators = Object.keys(allDecorators)
    .filter(addon => addons.includes(addon))
    .map(addon => allDecorators[addon]);

  return decorators.reduce((sec, decorator) => decorator(sec), section);
}
