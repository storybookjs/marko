const projectTypes = {
  UNDETECTED: 'UNDETECTED',
  REACT_SCRIPTS: 'REACT_SCRIPTS',
  METEOR: 'METEOR',
  REACT: 'REACT',
  REACT_NATIVE: 'REACT_NATIVE',
  REACT_PROJECT: 'REACT_PROJECT',
  WEBPACK_REACT: 'WEBPACK_REACT',
  VUE: 'VUE',
  SFC_VUE: 'SFC_VUE',
  ANGULAR: 'ANGULAR',
  EMBER: 'EMBER',
  ALREADY_HAS_STORYBOOK: 'ALREADY_HAS_STORYBOOK',
  UPDATE_PACKAGE_ORGANIZATIONS: 'UPDATE_PACKAGE_ORGANIZATIONS',
  WEB_COMPONENTS: 'WEB_COMPONENTS',
  MITHRIL: 'MITHRIL',
  MARIONETTE: 'MARIONETTE',
  MARKO: 'MARKO',
  HTML: 'HTML',
  RIOT: 'RIOT',
  PREACT: 'PREACT',
  SVELTE: 'SVELTE',
  RAX: 'RAX',
};

export const supportedLanguages = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
};

export const supportedFrameworks = [
  'react',
  'react-native',
  'vue',
  'angular',
  'mithril',
  'riot',
  'ember',
  'marionette',
  'marko',
  'meteor',
  'preact',
  'svelte',
  'rax',
];

/**
 * Configuration objects to match a storybook preset template.
 *
 * This has to be an array sorted in order of specificity/priority.
 * Reason: both REACT and WEBPACK_REACT have react as dependency,
 * therefore WEBPACK_REACT has to come first, as it's more specific.
 *
 * @example
 * {
 *   preset: projectTypes.NEW_SUPPORTED_TEMPLATE,
 *   dependencies: [string], // optional, tests for these both as dependencies and devDependencies
 *   peerDependencies: [string], // optional
 *   files: [string], // optional
 *   matcherFunction: ({ dependencies, files, peerDependencies }) => {
 *     // every argument is returned as an array of booleans
 *     return // whatever assertion you want, as long as it returns boolean.
 *   },
 * }
 */
export const supportedTemplates = [
  {
    preset: projectTypes.METEOR,
    files: ['.meteor'],
    matcherFunction: ({ files }) => {
      return files.every(Boolean);
    },
  },
  {
    preset: projectTypes.SFC_VUE,
    dependencies: ['vue-loader', 'vuetify'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: projectTypes.VUE,
    dependencies: ['vue', 'nuxt'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: projectTypes.EMBER,
    dependencies: ['ember-cli'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.REACT_PROJECT,
    peerDependencies: ['react'],
    matcherFunction: ({ peerDependencies }) => {
      return peerDependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.REACT_NATIVE,
    dependencies: ['react-native', 'react-native-scripts'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: projectTypes.REACT_SCRIPTS,
    // For projects using a custom/forked `react-scripts` package.
    files: ['/node_modules/.bin/react-scripts'],
    // For standard CRA projects
    dependencies: ['react-scripts'],
    matcherFunction: ({ dependencies, files }) => {
      return dependencies.every(Boolean) || files.every(Boolean);
    },
  },
  {
    preset: projectTypes.WEBPACK_REACT,
    dependencies: ['react', 'webpack'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.REACT,
    dependencies: ['react'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.ANGULAR,
    dependencies: ['@angular/core'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.WEB_COMPONENTS,
    dependencies: ['lit-element'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.MITHRIL,
    dependencies: ['mithril'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.MARIONETTE,
    dependencies: ['backbone.marionette'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.MARKO,
    dependencies: ['marko'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.RIOT,
    dependencies: ['riot'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.PREACT,
    dependencies: ['preact'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: projectTypes.RAX,
    dependencies: ['rax'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
];

const notInstallableProjectTypes = [
  projectTypes.UNDETECTED,
  projectTypes.ALREADY_HAS_STORYBOOK,
  projectTypes.UPDATE_PACKAGE_ORGANIZATIONS,
];

export const installableProjectTypes = Object.values(projectTypes)
  .filter((type) => !notInstallableProjectTypes.includes(type))
  .map((type) => type.toLowerCase());

export default projectTypes;
