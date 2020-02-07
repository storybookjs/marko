import { StorybookSection } from '../types';

export function importMeta(addon: string) {
  return {
    importName: `with${addon.charAt(0).toUpperCase() + addon.slice(1)}`,
    moduleName: `@storybook/addon-${addon}`,
  };
}

export function decorateSimpleAddon(section: StorybookSection, addon: string) {
  const { title, imports, decorators, stories, ...options } = section;
  const { importName, moduleName } = importMeta(addon);

  return {
    title,
    imports: { ...imports, ...{ [moduleName]: [importName] } },
    decorators: [...decorators, importName],
    stories,
    ...options,
  };
}
