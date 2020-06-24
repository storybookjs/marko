import React, { Fragment } from 'react';
import { isChromatic } from 'chromatic';
import { addDecorator, addParameters } from '@storybook/react';
import { Global, ThemeProvider, themes, createReset, convert, styled } from '@storybook/theming';
import { withCssResources } from '@storybook/addon-cssresources';
import { DocsPage } from '@storybook/addon-docs/blocks';

import addHeadWarning from './head-warning';

if (process.env.NODE_ENV === 'development') {
  if (!process.env.DOTENV_DEVELOPMENT_DISPLAY_WARNING) {
    addHeadWarning('dotenv-env', 'Dotenv development file not loaded');
  }

  if (!process.env.STORYBOOK_DISPLAY_WARNING) {
    addHeadWarning('env-glob', 'Global storybook env var not loaded');
  }

  if (process.env.DISPLAY_WARNING) {
    addHeadWarning('env-extra', 'Global non-storybook env var loaded');
  }
}

addHeadWarning('preview-head-not-loaded', 'Preview head not loaded');
addHeadWarning('dotenv-file-not-loaded', 'Dotenv file not loaded');

addDecorator(withCssResources);

const themeDecorator = (storyFn, { globalArgs: { theme } }) => {
  const selectedTheme = theme === 'dark' ? themes.dark : themes.light;
  return (
    <ThemeProvider theme={convert(selectedTheme)}>
      <Global styles={createReset} />
      {storyFn()}
    </ThemeProvider>
  );
};

addDecorator(themeDecorator);

const ThemeBlock = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50vw',
    width: '50vw',
    height: '100vh',
    bottom: 0,
    overflow: 'auto',
    padding: 10,
  },
  ({ theme }) => ({
    background: theme.background.app,
    color: theme.color.defaultText,
  }),
  ({ side }) =>
    side === 'left'
      ? {
          left: 0,
          right: '50vw',
        }
      : {
          right: 0,
          left: '50vw',
        }
);

addDecorator((storyFn) =>
  isChromatic() ? (
    <Fragment>
      <ThemeProvider theme={convert(themes.light)}>
        <Global styles={createReset} />
      </ThemeProvider>
      <ThemeProvider theme={convert(themes.light)}>
        <ThemeBlock side="left">{storyFn()}</ThemeBlock>
      </ThemeProvider>
      <ThemeProvider theme={convert(themes.dark)}>
        <ThemeBlock side="right">{storyFn()}</ThemeBlock>
      </ThemeProvider>
    </Fragment>
  ) : (
    <ThemeProvider theme={convert(themes.light)}>
      <Global styles={createReset} />
      {storyFn()}
    </ThemeProvider>
  )
);

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  backgrounds: {
    default: 'storybook app',
    values: [
      { name: 'storybook app', value: themes.light.appBg },
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222' },
    ],
  },
  docs: {
    theme: themes.light,
    page: () => <DocsPage subtitleSlot={({ kind }) => `Subtitle: ${kind}`} />,
  },
});

export const parameters = {
  exportedParameter: 'exportedParameter',
};

export const globalArgs = {
  foo: 'fooValue',
};

export const globalArgTypes = {
  foo: { defaultValue: 'fooDefaultValue' },
  bar: { defaultValue: 'barDefaultValue' },
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: null,
    toolbar: {
      icon: 'circlehollow',
      // items: ['light', 'dark'],
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
      ],
    },
  },
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'kr', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};
