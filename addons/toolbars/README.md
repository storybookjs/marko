<center>
  <img src="https://raw.githubusercontent.com/storybookjs/storybook/next/addons/toolbars/docs/hero.gif" width="100%" />
</center>

<h1>Storybook Addon Toolbars</h1>

The Toolbars addon controls global story rendering options from Storybook's toolbar UI. It's a general purpose addon that can be used to:

- set a theme for your components
- set your components' internationalization (i18n) locale
- configure just about anything in Storybook that makes use of a global variable

Toolbars is built on top of [Storybook Args](https://github.com/storybookjs/storybook/blob/next/docs/src/pages/formats/component-story-format/index.md#args-story-inputs) (SB6.0+): dynamic variables that trigger a story re-render when they are set.

- [Get started](#get-started)
  - [Installation](#installation)
  - [Configure menu UI](#configure-menu-ui)
  - [Create a decorator](#create-a-decorator)
- [Advanced usage](#advanced-usage)
  - [Advanced menu configuration](#advanced-menu-configuration)
  - [Consuming global args from within a story](#consuming-global-args-from-within-a-story)
  - [Consuming global args from within an addon](#consuming-global-args-from-within-an-addon)
- [FAQs](#faqs)
  - [How does this compare to `addon-contexts`?](#how-does-this-compare-to-addon-contexts)

## Get started

To get started with `addon-toolbars`:

1. [install the addon](#installation),
2. [configure the menu UI](#configure-menu-ui)
3. [Create a decorator to implement custom logic](#create-a-decorator).

### Installation

First, install the package:

```sh
npm install @storybook/addon-toolbars -D # or yarn
```

Then add it to your `.storybook/main.js` config:

```js
module.exports = {
  addons: ['@storybook/addon-toolbars'],
};
```

### Configure menu UI

Addon-toolbars has a simple, declarative syntax for configuring toolbar menus. You can add toolbars by adding `globalTypes` with a `toolbar` annotation, in `.storybook/preview.js`:

```js
export const globalTypes = {
  theme: {
    name: 'Theme'
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      // array of plain string values or MenuItem shape (see below)
      items: ['light', 'dark'],
    },
  },
};
```

You should see a dropdown in your toolbar with options `light` and `dark`.

### Create a decorator

Now, let's wire it up! We can consume our new `theme` global arg in a decorator using the `context.globals.theme` value.

For example, suppose you are using `styled-components`. You can add a theme provider decorator to your `.storybook/preview.js` config:

```ts
import { ThemeProvider } from 'styled-components';
import { StoryContext, StoryGetter, StoryWrapper } from '@storybook/addons';

const withThemeProvider: StoryWrapper = (Story: StoryGetter, context: StoryContext) => {
  // context.globals.theme here will be either 'light' or 'dark'
  // getTheme being a function retrieving the actual theme object from that value
  const theme = getTheme(context.globals.theme);

  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];
```

## Advanced usage

The previous section shows the common case. There are two advanced use cases: (1) [advanced menu configurations](#advanced-menu-configuration), (2) [consuming global args inside a story](#consuming-global-args-from-within-a-story).

### Advanced menu configuration

The default menu configuration is simple: everything's a string! However, the Toolbars addon also support configuration options to tweak the appearance of the menu:

```ts
type MenuItem {
  /**
   * The string value of the menu that gets set in the global args
   */
  value: string,
  /**
   * The main text of the title
   */
  title: string,
  /**
   * A string that gets shown in left side of the menu, if set
   */
  left?: string,
  /**
   * A string that gets shown in right side of the menu, if set
   */
  right?: string,
  /**
   * An icon that gets shown in the toolbar if this item is selected
   */
  icon?: icon,
}
```

Thus if you want to show right-justified flags for an internationalization locale, you might set up the following configuration in `.storybook/preview.js`:

```js
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'fr', right: '🇫🇷', title: 'Français' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'kr', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};
```

### Consuming global args from within a story

The recommended usage, as shown in the examples above, is to consume global args from within a decorator and implement a global setting that applies to all stories. But sometimes it's useful to use toolbar options inside individual stories.

Storybook's `globals` are available via the story context:

```js
const getCaptionForLocale = (locale) => {
  switch(locale) {
    case 'es': return 'Hola!';
    case 'fr': return 'Bonjour!';
    case 'kr': return '안녕하세요!';
    case 'zh': return '你好!';
    default:
      return 'Hello!',
  }
}

export const StoryWithLocale = (args, { globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <>{caption}</>;
};
```

**NOTE:** In Storybook 6.0, if you set the global option `passArgsFirst: false` for backwards compatibility, the story context is passes as the second argument:

```js
export const StoryWithLocale = ({ globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <>{caption}</>;
};
```

### Consuming global args from within an addon

There is a hook available in `@storybook/api` to retrieve the global args: `useGlobals()`

Following the previous example of the ThemeProvider, if you want for instance to display the current theme inside a Panel:

```js
import { useGlobals } from '@storybook/api';
import { AddonPanel, Placeholder, Separator, Source, Spaced, Title } from '@storybook/components';

const ThemePanel = props => {
  const [{ theme: themeName }] = useGlobals();
  const theme = getTheme(themeName);

  return (
    <AddonPanel {...props}>
      {theme ? (
        <Spaced row={3} outer={1}>
          <Title>{theme.name}</Title>
          <p>The full theme object/p>
          <Source code={JSON.stringify(theme, null, 2)} language="js" copyable padded showLineNumbers />
        </Spaced>
      ) : (
        <Placeholder>No theme selected</Placeholder>
      )}
    </AddonPanel>
  );
};
```

## FAQs

### How does this compare to `addon-contexts`?

`Addon-toolbars` is the successor to `addon-contexts`, which provided convenient global toolbars in Storybook's toolbar.

The primary difference between the two packages is that `addon-toolbars` makes use of Storybook's new **Story Args** feature, which has the following advantages:

- **Standardization**. Args are built into Storybook in 6.x. Since `addon-toolbars` is based on args, you don't need to learn any addon-specific APIs to use it.

- **Ergonomics**. Global args are easy to consume [in stories](#consuming-global-args-from-within-a-story), in [Storybook Docs](https://github.com/storybookjs/storybook/tree/master/addons/docs), or even in other addons.

* **Framework compatibility**. Args are completely framework-independent, so `addon-toolbars` is compatible with React, Vue, Angular, etc. out of the box with no framework logic needed in the addon.
