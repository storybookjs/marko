---
title: 'Feature support for frameworks'
---

Storybook integrates with many popular frontend frameworks. We do our best to keep feature parity amongst frameworks, but it’s tricky for our modest team to support every framework.

Below is a comprehensive table of what’s supported in which framework integration. If you’d like a certain feature supported in your framework, we welcome pull requests.

## Core frameworks

Core frameworks have dedicated maintainers or contributors who are responsible for maintaining the integration. As such, you can use most Storybook features in these frameworks.

NEW:
<FrameworkSupportTable frameworks={['react', 'vue', 'angular', 'html', 'ember']} />

ORIGINAL:

|                                             | [React](app/react) | [Vue](app/vue) | [Angular](app/angular) | [HTML](app/html) | [Ember](app/ember) |
| ------------------------------------------- | :----------------: | :------------: | :--------------------: | :--------------: | :----------------: |
| Addons                                      |                    |                |                        |                  |                    |
| [a11y](addons/a11y)                         |         +          |       +        |           +            |        +         |         +          |
| [actions](addons/actions)                   |         +          |       +        |           +            |        +         |         +          |
| [backgrounds](addons/backgrounds)           |         +          |       +        |           +            |        +         |         +          |
| [cssresources](addons/cssresources)         |         +          |       +        |           +            |        +         |         +          |
| [design assets](addons/design-assets)       |         +          |       +        |           +            |        +         |         +          |
| [docs](addons/docs)                         |         +          |       +        |           +            |        +         |         +          |
| [events](addons/events)                     |         +          |       +        |           +            |        +         |         +          |
| [google-analytics](addons/google-analytics) |         +          |       +        |           +            |        +         |         +          |
| [graphql](addons/graphql)                   |         +          |                |           +            |                  |                    |
| [jest](addons/jest)                         |         +          |       +        |           +            |        +         |         +          |
| [knobs](addons/knobs)                       |         +          |       +        |           +            |        +         |         +          |
| [links](addons/links)                       |         +          |       +        |           +            |        +         |         +          |
| [options](addons/options)                   |         +          |       +        |           +            |        +         |         +          |
| [query params](addons/queryparams)          |         +          |       +        |           +            |        +         |         +          |
| [storyshots](addons/storyshots)             |         +          |       +        |           +            |        +         |                    |
| [storysource](addons/storysource)           |         +          |       +        |           +            |        +         |         +          |
| [viewport](addons/viewport)                 |         +          |       +        |           +            |        +         |         +          |
| Docs                                        |                    |                |                        |                  |                    |
| MDX Stories                                 |         +          |       +        |           +            |        +         |         +          |
| CSF Stories                                 |         +          |       +        |           +            |        +         |         +          |
| StoriesOf Stories                           |         +          |       +        |           +            |        +         |         +          |
| Source                                      |         +          |       +        |           +            |        +         |         +          |
| Notes/Info                                  |         +          |       +        |           +            |                  |         +          |
| Props table                                 |         +          |       +        |           +            |        +         |         +          |
| Props controls                              |         +          |       +        |                        |                  |                    |
| Description                                 |         +          |       +        |           +            |                  |         +          |
| Inline stories                              |         +          |       +        |                        |                  |                    |

## Community frameworks

Community frameworks have fewer contributors which means they may not be as up to date as core frameworks. If you use one of these frameworks for your job, please consider contributing to its integration with Storybook.

NEW:
<FrameworkSupportTable frameworks={['mithril', 'marko', 'svelte', 'riot', 'preact', 'rax']} />

ORIGINAL:

|                                             | [Mithril](app/mithril) | [Marko](app/marko) | [Svelte](app/svelte) | [Riot](app/riot) | [Preact](app/preact) | [Rax](app/rax) |
| ------------------------------------------- | :--------------------: | :----------------: | :------------------: | :--------------: | :------------------: | -------------- |
| [a11y](addons/a11y)                         |           +            |         +          |          +           |        +         |          +           | +              |
| [actions](addons/actions)                   |           +            |         +          |          +           |        +         |          +           | +              |
| [backgrounds](addons/backgrounds)           |           +            |         +          |          +           |        +         |          +           | +              |
| [cssresources](addons/cssresources)         |           +            |         +          |          +           |        +         |          +           | +              |
| [design assets](addons/design-assets)       |           +            |         +          |          +           |        +         |          +           | +              |
| [docs](addons/docs)                         |           +            |         +          |          +           |        +         |          +           | +              |
| [events](addons/events)                     |           +            |         +          |                      |                  |          +           | +              |
| [google-analytics](addons/google-analytics) |           +            |         +          |          +           |        +         |          +           | +              |
| [graphql](addons/graphql)                   |                        |                    |                      |                  |                      |                |
| [jest](addons/jest)                         |           +            |         +          |          +           |        +         |          +           | +              |
| [knobs](addons/knobs)                       |           +            |         +          |          +           |        +         |          +           | +              |
| [links](addons/links)                       |           +            |                    |          +           |        +         |          +           | +              |
| [options](addons/options)                   |           +            |                    |          +           |        +         |          +           | +              |
| [query params](addons/queryparams)          |           +            |         +          |          +           |        +         |          +           | +              |
| [storyshots](addons/storyshots)             |                        |                    |          +           |        +         |                      | +              |
| [storysource](addons/storysource)           |           +            |         +          |          +           |        +         |          +           | +              |
| [viewport](addons/viewport)                 |           +            |         +          |          +           |        +         |          +           | +              |
| Docs                                        |                        |                    |                      |                  |                      |                |
| MDX Stories                                 |           +            |         +          |          +           |        +         |          +           | +              |
| CSF Stories                                 |           +            |         +          |          +           |        +         |          +           | +              |
| StoriesOf Stories                           |           +            |         +          |          +           |        +         |          +           | +              |
| Source                                      |           +            |         +          |          +           |        +         |          +           | +              |
| Notes/Info                                  |           +            |         +          |          +           |                  |          +           | +              |
| Props table                                 |                        |                    |                      |                  |                      | +              |
| Props controls                              |                        |                    |                      |                  |                      | +              |
| Description                                 |                        |                    |                      |                  |                      | +              |
| Inline stories                              |                        |                    |                      |                  |                      | +              |
