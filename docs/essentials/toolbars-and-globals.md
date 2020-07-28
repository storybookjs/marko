---
title: 'Toolbars & globals'
---

By default, Storybook ships with toolbar items to control the [viewport](./viewport) and [background](./backgrounds) the story renders in. You can also create your own toolbar items which control special “globals” which you can then read to create [decorators](../writing-stories/decorators) to control story rendering.

### Globals

Globals in Storybook represent “global” (as in not story-specific) inputs to the rendering of the story. As they aren’t specific to the story, they aren’t passed in the `args` argument to the story function (although they are accessible as `context.globals`), but typically you use them in decorators which apply to all stories.

When the globals change, the story re-renders and the decorators rerun with the new values. The easiest way to change globals is to create a toolbar item for them. 

Let’s see how.

### Global Types and the toolbar annotation

Storybook has a simple, declarative syntax for configuring toolbar menus. In your [`.storybook/preview.js`](../configure/overview#configure-story-rendering), you can add your own toolbars by creating `globalTypes` with a `toolbar` annotation: 

```js
// .storybook/preview.js

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

> As globals are *global* you can *only* set `globalTypes` in [`.storybook/preview.js`](../configure/overview#configure-story-rendering).

When you start your Storybook, you should see a new dropdown in your toolbar with options `light` and `dark`.

### Create a decorator

We have a `global` defined, let's wire it up! We can consume our new `theme` global in a decorator using the `context.globals.theme` value.

For example, suppose you are using `styled-components`. You can add a theme provider decorator to your [`.storybook/preview.js`](../configure/overview#configure-story-rendering) config:

```js
// .storybook/preview.js

import { ThemeProvider } from 'styled-components';
import { StoryContext, StoryGetter, StoryWrapper } from '@storybook/addons';

const withThemeProvider=(Story,context)=>{
  const theme = getTheme(context.globals.theme);
  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  )
}
export const decorators = [withThemeProvider];
```

### Advanced usage

So far we've managed to create and consume a global inside Storybook. 

Now let's take a look at a more complex example. Let's suppose we wanted to implement a new global called __locale__ for internationalization, which shows a flag on the right side of the toolbar. 

In your [`.storybook/preview.js`](../configure/overview#configure-story-rendering), add the following:

```js
// ./storybook/preview.js
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

By adding the the configuration element `right`, the text will displayed on the right side in the toolbar menu, once you connect it to a decorator.

Here's a list of the configuration options available.

| MenuItem      | Type          | Description                                                  | Required |
| ------------- |:-------------:|:------------------------------------------------------------:|:--------:|
| **value**     | String        |The string value of the menu that gets set in the globals     |Yes       |
| **title**     | String        |The main text of the title                                    |Yes       |
| **left**      | String        |A string that gets shown in left side of the menu             |No        |
| **right**     | String        |A string that gets shown in right side of the menu            |No        |
| **icon**      | String        |An icon that gets shown in the toolbar if this item is selected|No        |

### Consuming globals from within a story

We recomend consuming globals from within a decorator and define a global setting for all stories. 

But we're aware that sometimes it's more useful to use toolbar options in a per-story basis.

Using the example above, you can modify any story to retrieve the __Locale__ `global` from the story context:

```js
// your-story.js

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

**NOTE:** In Storybook 6.0, if you set the global option `passArgsFirst: false` for backwards compatibility, the story context is passed as the second argument:

```js
// your-story.js
export const StoryWithLocale = ({ globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return <>{caption}</>;
};
```

### Consuming globals from within an addon

If you're working on a Storybook addon and you need to retrieve globals. You can do so, The `@storybook/api` package provides a hook for this scenario, you can use the `useGlobals()` hook to retrieve any globals you want. 

Using the ThemeProvider example above, you could expand it to display which current theme is being shown inside a Panel like so:

```js
// your-addon-register-file.js

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
