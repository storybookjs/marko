import React from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { themes } from '@storybook/theming';
import markdown from './markdown.stories.mdx';

export default {
  title: 'Addons/Docs/mdx-in-story',
  decorators: [(storyFn) => <DocsContainer context={{}}>{storyFn()}</DocsContainer>],
  parameters: {
    layout: 'fullscreen',
  },
};

// This renders the contents of the docs panel into story content
export const Typography = () => {
  const Docs = markdown.parameters.docs.page;
  return <Docs />;
};

export const DarkModeDocs = () => {
  const Docs = markdown.parameters.docs.page;
  return <Docs />;
};

DarkModeDocs.decorators = [
  (storyFn) => (
    <DocsContainer context={{ parameters: { docs: { theme: themes.dark } } }}>
      {storyFn()}
    </DocsContainer>
  ),
];
