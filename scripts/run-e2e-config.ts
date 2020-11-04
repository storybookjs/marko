import { Parameters } from './run-e2e';

const fromDeps = (...args: string[]): string =>
  [
    'cd {{name}}-{{version}}',
    // Create `yarn.lock` to force Yarn to consider adding deps in this directory
    // and not look for a yarn workspace in parent directory
    'touch yarn.lock',
    'yarn init --yes',
    args.length && `yarn add ${args.join(' ')}`,
  ]
    .filter(Boolean)
    .join(' && ');

const baseAngular: Parameters = {
  name: 'angular',
  version: 'latest',
  generator: [
    `yarn add @angular/cli@{{version}} --no-lockfile --non-interactive --silent --no-progress`,
    `yarn ng new {{name}}-{{version}} --routing=true --minimal=true --style=scss --skipInstall=true --strict`,
  ].join(' && '),
};

// export const angularv6: Parameters = {
//   ...baseAngular,
//   version: 'v6-lts',
//   additionalDeps: [...baseAngular.additionalDeps, 'core-js'],
// };

// TODO: enable back when typings issues are resolved
// export const angularv7: Parameters = {
//   ...baseAngular,
//   version: 'v7-lts',
//   additionalDeps: [...baseAngular.additionalDeps, 'core-js'],
// };

// export const angularv8: Parameters = {
//   ...baseAngular,
//   version: 'v8-lts',
//   additionalDeps: [...baseAngular.additionalDeps, 'core-js'],
// };

export const angularv9: Parameters = {
  ...baseAngular,
  version: 'v9-lts',
  additionalDeps: ['core-js'],
};

export const angular: Parameters = baseAngular;

// TODO: not working yet, help needed
// export const ember: Parameters = {
//   name: 'ember',
//   version: 'latest',
//   generator:
//     'npx ember-cli@{{version}} new {{name}}-{{version}} --skip-git --skip-npm --yarn --skip-bower',
//   preBuildCommand: 'ember build',
// };

export const html: Parameters = {
  name: 'html',
  version: 'latest',
  generator: fromDeps(),
  autoDetect: false,
};

// TODO: broken
// export const marionette: Parameters = {
//   name: 'marionette',
//   version: 'latest',
//   generator: fromDeps('backbone.marionette@{{version}}'),
// };

// TODO: not working on start-storybook
//  - Marko CLI is failing with Node 12 and looks to work with Node 10
//  - Demo components of @storybook/marko must be updated
//  - Marko Story templates of @storybook/cli must be updated
// export const marko: Parameters = {
//   name: 'marko',
//   version: 'latest',
//   generator: 'npx marko-cli@{{version}} create {{name}}-{{version}}',
//   ensureDir: false,
// };

// TODO: need to install meteor first
// export const meteor: Parameters = {
//   name: 'meteor',
//   version: 'latest',
//   generator: 'meteor create {{name}}-{{version}} --minimal --react',
// };

export const mithril: Parameters = {
  name: 'mithril',
  version: 'latest',
  generator: fromDeps('mithril@{{version}}'),
};

export const preact: Parameters = {
  name: 'preact',
  version: 'latest',
  generator:
    'npx preact-cli@{{version}} create preactjs-templates/default {{name}}-{{version}} --yarn --install=false --git=false',
  ensureDir: false,
};

export const rax: Parameters = {
  name: 'rax',
  version: 'latest',
  // Rax versions are inconsistent 1.1.0-1 for some
  generator: fromDeps('rax', 'rax-image', 'rax-link', 'rax-text', 'rax-view'),
};

export const react: Parameters = {
  name: 'react',
  version: 'latest',
  generator: fromDeps('react', 'react-dom'),
};

export const react_typescript: Parameters = {
  name: 'react_typescript',
  version: 'latest',
  generator: fromDeps('react', 'react-dom'),
  typescript: true,
};

// export const reactNative: Parameters = {
//   name: 'reactNative',
//   version: 'latest',
//   generator: 'npx expo-cli init {{name}}-{{version}} --template=bare-minimum --yarn',
// };

// TODO: issue in @storybook/cli init
export const cra: Parameters = {
  name: 'cra',
  version: 'latest',
  generator: [
    'npx create-react-app@{{version}} {{name}}-{{version}}',
    'cd {{name}}-{{version}}',
    'echo "FAST_REFRESH=true" > .env',
  ].join(' && '),
};

export const cra_typescript: Parameters = {
  name: 'cra_typescript',
  version: 'latest',
  generator: 'npx create-react-app@{{version}} {{name}}-{{version}} --template typescript',
};

// TODO: there is a compatibility issue with riot@4
// export const riot: Parameters = {
//   name: 'riot',
//   version: '3',
//   generator: fromDeps('riot@3', 'riot-compiler@3', 'riot-tmpl@3'),
// };

export const sfcVue: Parameters = {
  name: 'sfcVue',
  version: 'latest',
  generator: fromDeps('vue', 'vue-loader', 'vue-template-compiler'),
  additionalDeps: [
    'webpack@webpack-4',
    // TODO: remove when https://github.com/storybookjs/storybook/issues/11255 is solved
    'core-js',
  ],
};

export const svelte: Parameters = {
  name: 'svelte',
  version: 'latest',
  generator: 'npx degit sveltejs/template {{name}}-{{version}}',
};

export const vue: Parameters = {
  name: 'vue',
  version: 'latest',
  generator: `npx @vue/cli@{{version}} create {{name}}-{{version}} --default --packageManager=yarn --no-git --force`,
};

export const web_components: Parameters = {
  name: 'web_components',
  version: 'latest',
  generator: fromDeps('lit-html', 'lit-element'),
};

export const webpack_react: Parameters = {
  name: 'webpack_react',
  version: 'latest',
  generator: fromDeps('react', 'react-dom', 'webpack@webpack-4'),
};

export const react_in_yarn_workspace: Parameters = {
  name: 'react_in_yarn_workspace',
  version: 'latest',
  generator: [
    'cd {{name}}-{{version}}',
    'echo "{ \\"name\\": \\"workspace-root\\", \\"private\\": true, \\"workspaces\\": [] }" > package.json',
    `yarn add react react-dom --silent -W`,
  ].join(' && '),
};

// View results at: https://datastudio.google.com/reporting/c34f64ee-400f-4d06-ad4f-5c2133e226da
export const cra_bench: Parameters = {
  name: 'cra_bench',
  version: 'latest',
  generator: [
    'npx create-react-app@{{version}} {{name}}-{{version}}',
    'cd {{name}}-{{version}}',
    "npx @storybook/bench 'npx sb init' --label cra",
  ].join(' && '),
};
