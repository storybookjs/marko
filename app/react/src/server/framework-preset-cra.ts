import { Configuration } from 'webpack';
import { logger } from '@storybook/node-logger';
import { isReactScriptsInstalled } from './cra-config';
import type { StorybookOptions } from './types';

type Preset = string | { name: string };

const checkForNewPreset = (presetsList: Preset[]) => {
  const hasNewPreset = presetsList.some((preset: Preset) => {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    return /@storybook(\/|\\)preset-create-react-app/.test(presetName);
  });

  if (!hasNewPreset) {
    logger.warn('Storybook support for Create React App is now a separate preset.');
    logger.warn(
      'To use the new preset, install `@storybook/preset-create-react-app` and add it to the list of `addons` in your `.storybook/main.js` config file.'
    );
    logger.warn('The built-in preset has been disabled in Storybook 6.0.');
  }
};

export function webpackFinal(config: Configuration, { presetsList }: StorybookOptions) {
  if (isReactScriptsInstalled()) {
    checkForNewPreset(presetsList);
  }
  return config;
}
