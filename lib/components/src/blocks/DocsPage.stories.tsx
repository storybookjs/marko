import React from 'react';
import { DocumentFormatting } from '../typography/DocumentFormatting';
import { DocsPage } from './DocsPage';
import * as previewStories from './Preview.stories';
import * as propsStories from './Props.stories';
import * as sourceStories from './Source.stories';

export const componentMeta = {
  title: 'Docs|DocsPage',
  Component: DocsPage,
  decorators: [storyFn => <DocumentFormatting>{storyFn()}</DocumentFormatting>],
};

export const empty = () => (
  <DocsPage
    title={null}
    previewProps={previewStories.error().props}
    propsProps={propsStories.error().props}
    sourceProps={sourceStories.sourceUnavailable().props}
  />
);

export const normal = () => (
  <DocsPage
    title="normal"
    previewProps={previewStories.inline().props}
    propsProps={propsStories.normal().props}
    sourceProps={sourceStories.jsx().props}
  />
);
