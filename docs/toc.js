module.exports = {
  toc: [
    {
      title: 'Get Started',
      prefix: 'get-started',
      pages: ['introduction', 'install', 'whats-a-story', 'browse-stories', 'setup', 'conclusion'],
    },
    {
      title: 'Writing Stories',
      prefix: 'writing-stories',
      pages: [
        'introduction',
        'args',
        'parameters',
        'decorators',
        'naming-components-and-hierarchy',
      ],
    },
    {
      title: 'Writing Docs',
      prefix: 'writing-docs',
      pages: ['introduction', 'docs-page', 'mdx', 'doc-blocks'],
    },
    {
      title: 'Essentials',
      prefix:'essentials',
      pages:['introduction','controls','actions','viewports','backgrounds','toolbars-and-globals']
    },
    {
      title: 'Configure',
      prefix: 'configure',
      pages: ['overview', 'integration', 'story-rendering', 'user-interface'],
    },
    {
      title:'Workflows',
      prefix:'workflows',
      pages:[
        'publish-storybook',
        'build-pages-with-storybook',
        'stories-for-multiple-components',
        'testing-with-storybook',
        'unit-testing',
        'visual-testing',
        'interaction-testing',
        'snapshot-testing',
        'storybook-composition',
        'package-composition'
      ]
    },
    {

      pathSegment: 'api',
      type: 'menu',
      children:[
        {
          pathSegment: 'stories',
          title: 'Stories',
          type: 'link',
        },
        {
          pathSegment: 'csf',
          title: 'Component Story Format',
          description:'Learn about the Component Story Format API',
          type: 'bullet-link',
        },
        {
          pathSegment: 'mdx',
          title: 'MDX syntax',
          description:'Learn how to add MDX to your Storybook',
          type: 'bullet-link',
        },
        {
          pathSegment: 'argtypes',
          title: 'ArgTypes',
          description:'Learn how to use Argtypes with your Storybook',
          type: 'bullet-link',
        },
        {
          pathSegment: 'addons',
          title: 'Addons',
          type: 'link',
        },
        {
          pathSegment: 'addons-api',
          title: 'Addons API',
          type: 'link',
        },
        {
          pathSegment: 'presets',
          title: 'Presets',
          type: 'link',
        },
        {
          pathSegment: 'writing-presets',
          title: 'Writing your own Storybook Preset',
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