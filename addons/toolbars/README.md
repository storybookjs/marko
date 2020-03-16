<center>
  <img src="https://github.com/storybookjs/storybook/blob/next/addons/toolbars/docs/hero.gif" width="100%" />
</center>

<h1>Storybook Addon Toolbars</h1>

The Toolbars addon controls global story rendering options from Storybook's toolbar UI. It's a general purpose addon that can be used to:

- set a theme for your components
- set your components' internationalization (i18n) locale
- configure just about anything in Storybook that makes use of a global variable

Toolbars is implemented using Storybook Args (SB6.0+): dynamic variables that trigger a story re-render when they are set.

- [Get started](#get-started)
  - [Installation](#installation)
  - [Configure menu UI](#configure-menu-ui)
  - [Create a decorator](#create-a-decorator)
- [Advanced usage](#advanced-usage)
  - [Advanced menu configuration](#advanced-menu-configuration)
  - [Consuming global args from within a story](#consuming-global-args-from-within-a-story)
- [FAQs](#faqs)
  - [How does this compare to `addon-contexts`?](#how-does-this-compare-to-addon-contexts)

## Get started

To get started with `addon-toolbars`: (1) [install the addon](#installation), (2) [configure the menu UI](#configure-menu-ui), and (3) [Create a decorator to implement custom logic](#create-a-decorator).

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

Addon-toolbars has a simple, declarative syntax for configuring toolbar menus. You can add toolbars by adding `globalArgTypes` with a `toolbar` annotation, in `.storybook/preview.js`:

```js
export const globalArgTypes = {
  theme: {
    name: 'Theme'
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: { icon: 'circlehollow', items: ['light','dark'] },
  }
}
```

You should see a dropdown in your toolbar with options `light` and `dark`.

### Create a decorator

Now, let's wire it up! We can consume our new `theme` global arg in a decorator using the `context.globalArgs.theme` value.

For example, suppose you are using`styled-components`. You can add a theme provider decorator to your `.storybook/preview.js` config:

```js
const styledComponentsThemeDecorator = (storyFn, { globalArgs: { theme } }) => (
  <ThemeProvider {...getTheme(theme)}>{storyFn()}</ThemeProvider>
);

export const decorators = [styledComponentsThemeDecorator];
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
export const globalArgTypes = {
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
      }
    },
  },
};
```

### Consuming global args from within a story

The recommended usage, as shown in the examples above, is to consume global args from within a decorator and implement a global setting that applies to all stories. But sometimes it's useful to use toolbar options inside individual stories.

Storybook's `globalArgs` are available via the story context:

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

export const StoryWithLocale = ({ globalArgs: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <>{caption}</>
};
```

**NOTE:** In Storybook 6.0, if you set the global option `passArgsFirst`, the story context is passes as the second argument:

```js
export const StoryWithLocale = (args, { globalArgs: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <>{caption}</>;
};
```

## FAQs

### How does this compare to `addon-contexts`?

`Addon-toolbars` is the successor to `addon-contexts`, which provided convenient global toolbars in Storybook's toolbar.

The primary difference between the two packages is that `addon-toolbars` makes use of Storybook's new **Story Args** feature, which has the following advantages:

- **Standardization**. Args are built into Storybook in 6.x. Since `addon-toolbars` is based on args, you don't need to learn any addon-specific APIs to use it.

- **Ergonomics**. Global args are easy to consume [in stories](#consuming-global-args-from-within-a-story), in [Storybook Docs](https://github.com/storybookjs/storybook/tree/master/addons/docs), or even in other addons.

* **Framework compatibility**. Args are completely framework-independent, so `addon-toolbars` is compatible with React, Vue, Angular, etc. out of the box with no framework logic needed in the addon.
