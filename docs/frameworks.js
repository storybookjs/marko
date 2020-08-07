module.exports = {
  frameworks: ['react', 'react-ts', 'vue', 'angular'],
  features: [
    {
      name: 'a11y',
      unsupported: [],
    },
    {
      name: 'Actions',
      unsupported: [],
      path: 'essentials/actions',
    },
    {
      name: 'Backgrounds',
      unsupported: [],
      path: 'essentials/backgrounds',
    },
    {
      name: 'cssresources',
      unsupported: [],
    },
    {
      name: 'design-assets',
      unsupported: [],
    },
    {
      name: 'Docs',
      unsupported: [],
      path: 'writing-docs/introduction',
    },
    {
      name: 'events',
      unsupported: ['svelte', 'riot'],
    },
    {
      name: 'google-analytics',
      unsupported: [],
    },
    {
      name: 'graphql',
      supported: ['react', 'angular'],
    },
    {
      name: 'jest',
      unsupported: [],
    },
    {
      name: 'knobs',
      unsupported: [],
    },
    {
      name: 'links',
      unsupported: ['marko'],
    },
    {
      name: 'options',
      unsupported: ['marko'],
    },
    {
      name: 'query-params',
      unsupported: [],
    },
    {
      name: 'Storyshots',
      unsupported: ['ember', 'mithril', 'marko'],
      path: 'workflows/unit-testing',
    },
    {
      name: 'storysource',
      unsupported: [],
      path: 'essentials/actions',
    },
    {
      name: 'Viewport',
      unsupported: [],
      path: 'essentials/viewport',
    },
    {
      name: 'MDX Stories',
      unsupported: [],
      path: 'api/mdx',
    },
    {
      name: 'CSF Stories',
      unsupported: [],
      path: 'api/csf',
    },
    {
      name: 'storiesOf stories',
      unsupported: [],
      repoPath: 'lib/core/ADVANCED.md',
    },
    {
      name: 'Source',
      unsupported: [],
      path: '?',
    },
    {
      name: 'Notes/Info',
      unsupported: ['html', 'riot'],
      path: '?',
    },
    {
      name: 'Args Table',
      unsupported: ['react', 'vue', 'angular', 'html', 'ember', 'rax'],
      path: 'writing-docs/doc-blocks#argstable',
    },
    {
      name: 'Controls',
      supported: ['react', 'vue', 'rax'],
      path: 'essentials/controls',
    },
    {
      name: 'Description',
      unsupported: ['react', 'vue', 'angular', 'ember', 'rax'],
      path: 'FIXME',
    },
    {
      name: 'Inline stories',
      supported: ['react', 'vue', 'rax'],
      path: 'FIXME',
    },
  ],
};
