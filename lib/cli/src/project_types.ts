// Should match @storybook/<framework>
export type SupportedFrameworks =
  | 'react'
  | 'react-native'
  | 'vue'
  | 'angular'
  | 'mithril'
  | 'riot'
  | 'ember'
  | 'marionette'
  | 'marko'
  | 'meteor'
  | 'preact'
  | 'svelte'
  | 'rax'
  | 'aurelia'
  | 'html'
  | 'web-components';

export enum ProjectType {
  UNDETECTED = 'UNDETECTED',
  REACT_SCRIPTS = 'REACT_SCRIPTS',
  METEOR = 'METEOR',
  REACT = 'REACT',
  REACT_NATIVE = 'REACT_NATIVE',
  REACT_PROJECT = 'REACT_PROJECT',
  WEBPACK_REACT = 'WEBPACK_REACT',
  VUE = 'VUE',
  SFC_VUE = 'SFC_VUE',
  ANGULAR = 'ANGULAR',
  EMBER = 'EMBER',
  ALREADY_HAS_STORYBOOK = 'ALREADY_HAS_STORYBOOK',
  UPDATE_PACKAGE_ORGANIZATIONS = 'UPDATE_PACKAGE_ORGANIZATIONS',
  WEB_COMPONENTS = 'WEB_COMPONENTS',
  MITHRIL = 'MITHRIL',
  MARIONETTE = 'MARIONETTE',
  MARKO = 'MARKO',
  HTML = 'HTML',
  RIOT = 'RIOT',
  PREACT = 'PREACT',
  SVELTE = 'SVELTE',
  RAX = 'RAX',
  AURELIA = 'AURELIA',
}

export const SUPPORTED_FRAMEWORKS: SupportedFrameworks[] = [
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
  'aurelia',
];

export enum StoryFormat {
  CSF = 'csf',
  /** @deprecated only template-csf left for some frameworks */
  CSF_TYPESCRIPT = 'csf-ts',
  /** @deprecated only template-csf left for some frameworks */
  MDX = 'mdx',
}

export enum SupportedLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
}

export type TemplateMatcher = {
  files?: boolean[];
  dependencies?: boolean[];
  peerDependencies?: boolean[];
};

export type TemplateConfiguration = {
  preset: ProjectType;
  /** will be checked both against dependencies and devDependencies */
  dependencies?: string[];
  peerDependencies?: string[];
  files?: string[];
  matcherFunction: (matcher: TemplateMatcher) => boolean;
};

/**
 * Configuration to match a storybook preset template.
 *
 * This has to be an array sorted in order of specificity/priority.
 * Reason: both REACT and WEBPACK_REACT have react as dependency,
 * therefore WEBPACK_REACT has to come first, as it's more specific.
 */
export const supportedTemplates: TemplateConfiguration[] = [
  {
    preset: ProjectType.METEOR,
    files: ['.meteor'],
    matcherFunction: ({ files }) => {
      return files.every(Boolean);
    },
  },
  {
    preset: ProjectType.SFC_VUE,
    dependencies: ['vue-loader', 'vuetify'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.VUE,
    dependencies: ['vue', 'nuxt'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.EMBER,
    dependencies: ['ember-cli'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_PROJECT,
    peerDependencies: ['react'],
    matcherFunction: ({ peerDependencies }) => {
      return peerDependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_NATIVE,
    dependencies: ['react-native', 'react-native-scripts'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_SCRIPTS,
    // For projects using a custom/forked `react-scripts` package.
    files: ['/node_modules/.bin/react-scripts'],
    // For standard CRA projects
    dependencies: ['react-scripts'],
    matcherFunction: ({ dependencies, files }) => {
      return dependencies.every(Boolean) || files.every(Boolean);
    },
  },
  {
    preset: ProjectType.WEBPACK_REACT,
    dependencies: ['react', 'webpack'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT,
    dependencies: ['react'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.ANGULAR,
    dependencies: ['@angular/core'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.WEB_COMPONENTS,
    dependencies: ['lit-element'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.MITHRIL,
    dependencies: ['mithril'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.MARIONETTE,
    dependencies: ['backbone.marionette'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.MARKO,
    dependencies: ['marko'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.RIOT,
    dependencies: ['riot'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.PREACT,
    dependencies: ['preact'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.SVELTE,
    dependencies: ['svelte'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.RAX,
    dependencies: ['rax'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.AURELIA,
    dependencies: ['aurelia-bootstrapper'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
];

const notInstallableProjectTypes: ProjectType[] = [
  ProjectType.UNDETECTED,
  ProjectType.ALREADY_HAS_STORYBOOK,
  ProjectType.UPDATE_PACKAGE_ORGANIZATIONS,
];

export const installableProjectTypes = Object.values(ProjectType)
  .filter((type) => !notInstallableProjectTypes.includes(type))
  .map((type) => type.toLowerCase());
