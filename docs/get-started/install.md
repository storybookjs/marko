---
title: 'Install'
---

Use the Storybook CLI to install it in a single command. Run this inside your existing project’s root directory:

```sh
npx sb init
```
<div style="background-color:#F8FAFC">
TODO: vet this per feedback (https://github.com/storybookjs/storybook/pull/11632#discussion_r458498081)

</div>

Storybook needs to be installed into a project that is already configured. For instance with:

- 📦 [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- 📦 [Vue Cli](https://cli.vuejs.org/)


Or any other tooling available. 

During its install process, Storybook will look into your project's dependencies and provide you with the best configuration available.

If you want, you can also do this manually through the Storybook CLI. You can use the `--type` flag to tell Storybook to configure itself based value provided.

For instance you can use:

- `--type react` to setup Storybook with the React configuration options.
- `--type vue` to setup Storybook with the Vue configuration options.
- `--type angular` to setup Storybook with the Angular configuration options.


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
 
![Storybook welcome screen](./example-welcome.png)

#### Troubleshooting

If there's an installation problem, check the README for your framework (e.g [Storybook for React](https://github.com/storybookjs/storybook/app/react/README.md) for the detailed instructions)

If all else fails, try asking for [help](https://storybook.js.org/support/)

> > [Now that you installed Storybook successfully, let’s take a look at a story that was written for us](./whats-a-story.md)