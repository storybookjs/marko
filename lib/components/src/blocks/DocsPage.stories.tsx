import React from 'react';
import { DocsPage } from './DocsPage';
import * as previewStories from './Preview.stories';
import * as propsTableStories from './PropsTable/PropsTable.stories';
import * as sourceStories from './Source.stories';
import * as descriptionStories from './Description.stories';

export const componentMeta = {
  title: 'Docs|DocsPage',
  Component: DocsPage,
};

export const empty = () => (
  <DocsPage
    title={null}
    previewProps={previewStories.error().props}
    propsTableProps={propsTableStories.error().props}
    sourceProps={sourceStories.sourceUnavailable().props}
  />
);

export const noText = () => (
  <DocsPage
    title="no text"
    previewProps={previewStories.inline().props}
    propsTableProps={propsTableStories.normal().props}
    sourceProps={sourceStories.jsx().props}
  />
);
noText.title = 'no text';

export const text = () => (
  <DocsPage
    title="text"
    descriptionProps={descriptionStories.text().props}
    previewProps={previewStories.inline().props}
    propsTableProps={propsTableStories.normal().props}
    sourceProps={sourceStories.jsx().props}
  />
);

export const markdown = () => (
  <DocsPage
    title="markdown"
    descriptionProps={descriptionStories.markdown().props}
    previewProps={previewStories.inline().props}
    propsTableProps={propsTableStories.normal().props}
    sourceProps={sourceStories.jsx().props}
  />
);
