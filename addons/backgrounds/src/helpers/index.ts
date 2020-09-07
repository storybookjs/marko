import { document } from 'global';
import dedent from 'ts-dedent';

import { logger } from '@storybook/client-logger';

import { Background } from '../types';

export const getBackgroundColorByName = (
  currentSelectedValue: string,
  backgrounds: Background[] = [],
  defaultName: string
): string => {
  if (currentSelectedValue === 'transparent') {
    return 'transparent';
  }

  if (backgrounds.find((background) => background.value === currentSelectedValue)) {
    return currentSelectedValue;
  }

  const defaultBackground = backgrounds.find((background) => background.name === defaultName);
  if (defaultBackground) {
    return defaultBackground.value;
  }

  if (defaultName) {
    const availableColors = backgrounds.map((background) => background.name).join(', ');
    logger.warn(
      dedent`
        Backgrounds Addon: could not find the default color "${defaultName}".
        These are the available colors for your story based on your configuration:
        ${availableColors}.
      `
    );
  }

  return 'transparent';
};

export const clearStyles = (selector: string | string[]) => {
  const selectors = Array.isArray(selector) ? selector : [selector];
  selectors.forEach(clearStyle);
};

const clearStyle = (selector: string) => {
  const element = document.getElementById(selector) as HTMLElement;
  if (element) {
    element.parentElement.removeChild(element);
  }
};

export const addStyles = (selector: string | string[], css: string) => {
  const selectors = Array.isArray(selector) ? selector : [selector];
  selectors.forEach((selec: string) => addStyle(selec, css));
};

export const addStyle = (selector: string, css: string) => {
  const existingStyle = document.getElementById(selector) as HTMLElement;
  if (existingStyle) {
    if (existingStyle.innerHTML !== css) {
      existingStyle.innerHTML = css;
    }
  } else {
    const style = document.createElement('style') as HTMLElement;
    style.setAttribute('id', selector);
    style.innerHTML = css;
    document.head.appendChild(style);
  }
};
