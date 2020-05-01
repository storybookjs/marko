export const PROJECT_TYPES = {
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

export const STORY_FORMAT = {
  CSF: 'csf',
  CSF_TYPESCRIPT: 'csf-ts',
  MDX: 'mdx',
};

export const SUPPORTED_LANGUAGES = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
};

export const SUPPORTED_FRAMEWORKS = [
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
 *   preset: PROJECT_TYPES.NEW_SUPPORTED_TEMPLATE,
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
    preset: PROJECT_TYPES.METEOR,
    files: ['.meteor'],
    matcherFunction: ({ files }) => {
      return files.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.SFC_VUE,
    dependencies: ['vue-loader', 'vuetify'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.VUE,
    dependencies: ['vue', 'nuxt'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.EMBER,
    dependencies: ['ember-cli'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.REACT_PROJECT,
    peerDependencies: ['react'],
    matcherFunction: ({ peerDependencies }) => {
      return peerDependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.REACT_NATIVE,
    dependencies: ['react-native', 'react-native-scripts'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.REACT_SCRIPTS,
    // For projects using a custom/forked `react-scripts` package.
    files: ['/node_modules/.bin/react-scripts'],
    // For standard CRA projects
    dependencies: ['react-scripts'],
    matcherFunction: ({ dependencies, files }) => {
      return dependencies.every(Boolean) || files.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.WEBPACK_REACT,
    dependencies: ['react', 'webpack'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.REACT,
    dependencies: ['react'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.ANGULAR,
    dependencies: ['@angular/core'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.WEB_COMPONENTS,
    dependencies: ['lit-element'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.MITHRIL,
    dependencies: ['mithril'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.MARIONETTE,
    dependencies: ['backbone.marionette'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.MARKO,
    dependencies: ['marko'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.RIOT,
    dependencies: ['riot'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.PREACT,
    dependencies: ['preact'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.SVELTE,
    dependencies: ['svelte'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: PROJECT_TYPES.RAX,
    dependencies: ['rax'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
];

const notInstallableProjectTypes = [
  PROJECT_TYPES.UNDETECTED,
  PROJECT_TYPES.ALREADY_HAS_STORYBOOK,
  PROJECT_TYPES.UPDATE_PACKAGE_ORGANIZATIONS,
];

export const installableProjectTypes = Object.values(PROJECT_TYPES)
  .filter((type) => !notInstallableProjectTypes.includes(type))
  .map((type) => type.toLowerCase());
