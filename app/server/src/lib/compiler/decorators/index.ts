import { StorybookSection, Decorator } from '../types';
import { knobsDecorator } from './knobs';

const allDecorators: Record<string, Decorator> = {
  knobs: knobsDecorator,
};

export function decorateSection(section: StorybookSection, addons: string[]): StorybookSection {
  const decorators = Object.keys(allDecorators)
    .filter(addon => addons.includes(addon))
    .map(addon => allDecorators[addon]);

  return decorators.reduce((sec, decorator) => decorator(sec), section);
}
