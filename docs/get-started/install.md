---
title: 'Install'
---

Use the Storybook CLI to install it in a single command. Run this inside your existing project’s root directory:

```sh
npx sb init
```

<div style="background-color:#F8FAFC">
TODO: ask tom/dom how to proceed on this item

> If you haven’t started your project yet, we advise… ? TK (needs to be vetted)
</div>

The command above will make the following changes to your local environment:

- 📦 Install the required dependencies.
- 🛠 Setup the necessary scripts to run and build Storybook.
- 🛠 Add the default Storybook configuration.
- 📝 Add some boilerplate stories to get you started.

Check that everything worked by running:

```sh
npx storybook
```

It will start Storybook locally and output the address. Depending on your system configuration, it will automatically open the address in a new browser tab and you'll be greeted by a welcome screen. In that screen there are some noteworthy items:

- A collection of useful links for more in depth configuration and customization options you have at your disposal.
- A second set of links for you to expand your Storybook knowledge and get involved with the ever growing Storybook community.
- A few example stories to get you started.

<div style="background-color:#F8FAFC">
 TODO: add required image per 6.0 doc and assets spreadsheet (Storybook Welcome screen)
</div>

#### Troubleshooting

If there's an installation problem, check the README for your framework (e.g [Storybook for React](https://github.com/storybookjs/storybook/app/react/README.md) for the detailed instructions)

<div style="background-color:#F8FAFC">
TODO: ask dom/tom if the link is correct (basics/community/), or will be a Gatsby page.
</div>

If all else fails, try [asking for help](../basics/community).

> > [Now that you installed Storybook successfully, let’s take a look at a story that was written for us](./whats-a-story.md)