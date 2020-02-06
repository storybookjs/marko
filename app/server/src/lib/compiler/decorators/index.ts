import { StorybookSection, Decorator } from '../types';
import { decorateSimpleAddon } from './utils';
import { knobsDecorator } from './knobs';
import { actionsDecorator } from './actions';

function createSimpleDecorator(addon: string) {
  return (section: StorybookSection): StorybookSection => decorateSimpleAddon(section, addon);
}

const allDecorators: Record<string, Decorator> = {
  a11y: createSimpleDecorator('a11y'),
  links: createSimpleDecorator('links'),
  knobs: knobsDecorator,
  actions: actionsDecorator,
};

export function decorateSection(section: StorybookSection, addons: string[]): StorybookSection {
  const decorators = Object.keys(allDecorators)
    .filter(addon => addons.includes(addon))
    .map(addon => allDecorators[addon]);

  return decorators.reduce((sec, decorator) => decorator(sec), section);
}
