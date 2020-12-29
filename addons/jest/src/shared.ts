import type { Parameters } from '@storybook/addons';

// addons, panels and events get unique names using a prefix
export const PARAM_KEY = 'test';
export const ADDON_ID = 'storybookjs/test';
export const PANEL_ID = `${ADDON_ID}/panel`;

export const ADD_TESTS = `${ADDON_ID}/add_tests`;

interface AddonParameters extends Parameters {
  jest?: string | string[] | { disable: true } | null;
}

export function defineJestParameters(parameters: AddonParameters): string[] | null {
  const { jest, fileName: filePath } = parameters;

  console.log(jest);

  if (typeof jest === 'string') {
    return [jest];
  }

  if (jest && Array.isArray(jest)) {
    return jest;
  }

  if (jest === undefined) {
    const fileName = filePath.split('/').pop().split('.')[0];
    return [fileName];
  }

  return null;
}
