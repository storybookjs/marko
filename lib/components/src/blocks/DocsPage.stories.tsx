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

const emptyProps = {
  title: null,
  previewProps: previewStories.error.props,
  propsProps: propsStories.error.props,
  sourceProps: sourceStories.sourceUnavailable.props,
};
export const empty = () => <DocsPage {...emptyProps} />;

const normalProps = {
  title: 'normal',
  previewProps: previewStories.inline.props,
  propsProps: propsStories.normal.props,
  sourceProps: sourceStories.jsx.props,
};
export const normal = () => <DocsPage {...normalProps} />;
normal.props = normalProps;
