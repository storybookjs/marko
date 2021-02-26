---
title: 'Features and behavior'
---

To control the layout of Storybook’s UI you can use the `setConfig` addons API in your [`.storybook/manager.js`](./overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-config-layout.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The following table details how to use the API values:

| Name                  | Type          | Description                                                   | Example Value                                  |
| ----------------------|:-------------:|:-------------------------------------------------------------:|:----------------------------------------------:|
| **isFullscreen**      | Boolean       |Show story component as full screen                            |`false`                                         |
| **showNav**           | Boolean       |Display panel that shows a list of stories                     |`true`                                          |
| **showPanel**         | Boolean       |Display panel that shows addon configurations                  |`true`                                          |
| **panelPosition**     | String/Object |Where to show the addon panel                                  |`bottom` or `right`                             |
| **enableShortcuts**   | Boolean       |Enable/disable shortcuts                                       |`true`                                          |
| **isToolshown**       | String        |Show/hide tool bar                                             |`true`                                          |
| **theme**             | Object        |Storybook Theme, see next section                              |`undefined`                                     |
| **selectedPanel**     | String        |Id to select an addon panel                                    |`my-panel`                                      |
| **initialActive**     | String        |Select the default active tab on Mobile                        |`sidebar` or `canvas` or `addons`               |
| **sidebar**           | Object        |Sidebar options, see below                                     |`{ showRoots: false }`                          |

The following options are configurable under the `sidebar` namespace:

| Name                  | Type          | Description                                                   | Example Value                                  |
| ----------------------|:-------------:|:-------------------------------------------------------------:|:----------------------------------------------:|
| **showRoots**         | Boolean       |Display the top-level nodes as a "root" in the sidebar         |`false`                                         |
| **collapsedRoots**    | Array         |Set of root node IDs to visually collapse by default           |`['misc', 'other']`                             |
