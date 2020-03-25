import { StorybookSection, Decorator } from '../types';
import { knobsDecorator } from './knobs';
import { actionsDecorator } from './actions';

const allDecorators: Record<string, Decorator> = {
  knobs: knobsDecorator,
  actions: actionsDecorator,
};

export function decorateSection(section: StorybookSection, addons: string[]): StorybookSection {
  const decorators = Object.keys(allDecorators)
    .filter(addon => addons.includes(addon))
    .map(addon => allDecorators[addon]);

  return decorators.reduce((sec, decorator) => decorator(sec), section);
}
