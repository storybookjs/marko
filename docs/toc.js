module.exports = {
  toc: [
    {
      title: 'Get Started',
      pathSegment: 'get-started',
      type: 'menu',
      children: [
        {
          pathSegment: 'introduction',
          title: 'Introduction',
          type: 'bullet-link',
        },
        {
          pathSegment: 'install',
          title: 'Install',
          type: 'bullet-link',
          // DOCSTODO: Update the description
          description: 'Install the Storybook package in your project',
        },
        {
          pathSegment: 'whats-a-story',
          title: "What's a story?",
          type: 'bullet-link',
          // DOCSTODO: Update the description
          description: 'Learn the base construct of stories within Storybook',
        },
        {
          pathSegment: 'browse-stories',
          title: 'Browse stories',
          type: 'bullet-link',
          // DOCSTODO: Update the description
          description: 'Learn how to explore your stories within Storybook',
        },
        {
          pathSegment: 'setup',
          title: 'Setup',
          type: 'bullet-link',
          // DOCSTODO: Update the description
          description:
            'Write your first story & adjust Storybook configuration for your environment',
        },
        {
          pathSegment: 'conclusion',
          title: 'Conclusion',
          type: 'bullet-link',
          // DOCSTODO: Update the description
          description: 'Take your Storybook skills to the next level',
        },
      ],
    },
    {
      title: 'Writing Stories',
      pathSegment: 'writing-stories',
      type: 'menu',
      children: [
        {
          pathSegment: 'introduction',
          title: 'Introduction',
          type: 'link',
        },
        {
          pathSegment: 'args',
          title: 'Args',
          type: 'link',
        },
        {
          pathSegment: 'parameters',
          title: 'Parameters',
          type: 'link',
        },
        {
          pathSegment: 'decorators',
          title: 'Decorators',
          type: 'link',
        },
        {
          pathSegment: 'naming-components-and-hierarchy',
          title: 'Naming components and hierarchy',
          type: 'link',
        },
      ],
    },
    {
      title: 'Writing Docs',
      pathSegment: 'writing-docs',
      type: 'menu',
      children: [
        {
          pathSegment: 'introduction',
          title: 'Introduction',
          type: 'link',
        },
        {
          pathSegment: 'docs-page',
          title: 'Docs Page',
          type: 'link',
        },
        {
          pathSegment: 'mdx',
          title: 'MDX',
          type: 'link',
        },
        {
          pathSegment: 'doc-blocks',
          title: 'Docs Blocks',
          type: 'link',
        },
      ],
    },
    {
      title: 'Essentials',
      pathSegment: 'essentials',
      type: 'menu',
      children: [
        {
          pathSegment: 'introduction',
          title: 'Introduction',
          type: 'link',
        },
        {
          pathSegment: 'controls',
          title: 'Controls',
          type: 'link',
        },
        {
          pathSegment: 'actions',
          title: 'Actions',
          type: 'link',
        },
        {
          pathSegment: 'viewports',
          title: 'Viewports',
          type: 'link',
        },
        {
          pathSegment: 'backgrounds',
          title: 'Backgrounds',
          type: 'link',
        },
        {
          pathSegment: 'toolbars-and-globals',
          title: 'Toolbars & globals',
          type: 'link',
        },
      ],
    },
    {
      title: 'Configure',
      pathSegment: 'configure',
      type: 'menu',
      children: [
        {
          pathSegment: 'overview',
          title: 'Overview',
          type: 'link',
        },
        {
          pathSegment: 'integration',
          title: 'Integration',
          type: 'link',
        },
        {
          pathSegment: 'story-rendering',
          title: 'Story rendering',
          type: 'link',
        },
        {
          pathSegment: 'user-interface',
          title: 'User interface',
          type: 'link',
        },
      ],
    },
    {
      title: 'Workflows',
      pathSegment: 'workflows',
      type: 'menu',
      children: [
        {
          pathSegment: 'publish-storybook',
          title: 'Publish Storybook',
          type: 'link',
        },
        {
          pathSegment: 'build-pages-with-storybook',
          title: 'Building pages with Storybook',
          type: 'link',
        },
        {
          pathSegment: 'stories-for-multiple-components',
          title: 'Stories for multiple components',
          type: 'link',
        },
        {
          title: 'Testing with Storybook',
          // Despite having a child menu, this does not currently affect the path
          pathSegment: '',
          type: 'menu',
          children: [
            {
              pathSegment: 'testing-with-storybook',
              title: 'Introduction',
              type: 'link',
            },
            {
              pathSegment: 'unit-testing',
              title: 'Unit testing',
              type: 'link',
            },
            {
              pathSegment: 'visual-testing',
              title: 'Visual testing',
              type: 'link',
            },
            {
              pathSegment: 'interaction-testing',
              title: 'Interaction testing',
              type: 'link',
            },
            {
              pathSegment: 'snapshot-testing',
              title: 'Snapshot testing',
              type: 'link',
            },
          ],
        },
        {
          pathSegment: 'storybook-composition',
          title: 'Storybook Composition',
          type: 'link',
        },
        {
          pathSegment: 'package-composition',
          title: 'Package Composition',
          type: 'link',
        },
      ],
    },
    {
      title: 'API',
      pathSegment: 'api',
      type: 'menu',
      children: [
        {
          pathSegment: 'stories',
          title: 'Stories',
          type: 'link',
        },
        {
          pathSegment: 'addons',
          title: 'Addons',
          type: 'link',
        },
        {
          pathSegment: 'new-frameworks',
          title: 'Frameworks',
          type: 'link',
        },
        {
          pathSegment: 'cli-options',
          title: 'CLI Options',
          type: 'link',
        },
        {
          pathSegment: 'frameworks-feature-support',
          title: 'Feature support for frameworks',
          type: 'link',
        },
      ],
    },
  ],
};
