module.exports = {
  coreFrameworks: ['react', 'vue', 'angular', 'web-components'],
  communityFrameworks: ['ember', 'html', 'mithril', 'marko', 'svelte', 'riot', 'preact', 'rax'],
  featureGroups: [
    {
      name: 'Essentials',
      features: [
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
          name: 'Docs',
          unsupported: [],
          path: 'writing-docs/introduction',
        },
        {
          name: 'Viewport',
          unsupported: [],
          path: 'essentials/viewport',
        },
        {
          name: 'Controls',
          supported: ['react', 'vue', 'angular', 'web-components', 'ember'],
          path: 'essentials/controls',
        },
      ],
    },
    {
      name: 'Addons',
      features: [
        {
          name: 'a11y',
          unsupported: [],
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
          name: 'queryparams',
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
        },
      ],
    },
    {
      name: 'Docs',
      features: [
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
          repoPath: 'lib/core/docs/storiesOf.md',
        },
        {
          name: 'Source',
          unsupported: [],
          path: 'writing-docs/doc-blocks#source',
        },
        {
          name: 'Dynamic source',
          supported: ['react'],
          path: 'writing-docs/doc-blocks#source',
        },
        {
          name: 'Args Table',
          supported: ['react', 'vue', 'angular', 'html', 'ember', 'web-components'],
          path: 'writing-docs/doc-blocks#argstable',
        },
        {
          name: 'Description',
          supported: ['react', 'vue', 'angular', 'ember', 'web-components'],
          path: 'writing-docs/doc-blocks#description',
        },
        {
          name: 'Inline stories',
          supported: ['react', 'vue', 'web-components', 'html', 'svelte'],
          path: 'writing-docs/doc-blocks#inline-rendering',
        },
      ],
    },
  ],
};
