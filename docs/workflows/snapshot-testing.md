---
title: 'Snapshot testing with Storybook'
---

Snapshot tests compare the rendered markup of every story against known baselines. It’s an easy way to identify markup changes that trigger rendering errors and warnings.

Storybook is a convenient tool for snapshot testing because every story is essentially a test specification. Any time you write or update a story you get a snapshot test for free.

Storyshots is an [official addon](https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core) that enables snapshot testing. It’s powered by Jest so you’ll need to [install that](https://jestjs.io/docs/en/getting-started) first. Continue on if you already have Jest.

Install the addon. **Make sure** the version of Storyshots and your project’s Storybook version are identical.

```shell
yarn add --dev @storybook/addon-storyshots
```

Configure Storyshots by adding the following test file to your project:

```js
// storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

<div class="aside">

You can name the file whatever you like as long as it's picked up by Jest.

</div>

Run your first test. Storyshot will recognize all your CSF files (based on [`.storybook/main.js`](../configure/overview.md#configure-story-rendering)) and produces snapshots.

```shell
yarn test storybook.test.js
```

<div style="background-color:#F8FAFC">
TODO: ask for clarification on this note below. What extra steps?
</div>

<div class="aside">

If you are loading stories via `.storybook/main.js`, you will need to follow some more steps to ensure Jest finds them.

</div>

This will create an initial set of snapshots inside your Storybook config directory.

![Successfull snapshot tests](./storyshots-pass.png)

When you make changes to your components or stories, run the test again to identify the changes to the rendered markup.

![Failing snapshots](./storyshots-fail.png)

If the changes are intentional we can accept them as new baselines. If the changes are bugs, fix the underlying code then run the snapshot tests again.

Storyshots has many options for advanced use cases; read more in the [addon’s documentation](https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core).

<div class="aside">

Snapshot vs visual tests. [Visual tests](./visual-testing.md) take screenshots of stories and compare them against known baselines. When used to test appearance, visual tests are often a more robust solution than snapshot tests because verifying markup doesn’t test for visual changes.

</div>
