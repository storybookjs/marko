import React, { createElement, ElementType, FunctionComponent, ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { components as docsComponents } from '@storybook/components/html';
import { Story as PureStory, StoryProps as PureStoryProps } from '@storybook/components';
import { toId, storyNameFromExport } from '@storybook/csf';
import { CURRENT_SELECTION } from './types';

import { DocsContext, DocsContextProps } from './DocsContext';

export const storyBlockIdFromId = (storyId: string) => `story--${storyId}`;

const resetComponents: Record<string, ElementType> = {};
Object.keys(docsComponents).forEach((key) => {
  resetComponents[key] = (props: any) => createElement(key, props);
});

interface CommonProps {
  height?: string;
  inline?: boolean;
}

type StoryDefProps = {
  name: string;
  children: ReactNode;
} & CommonProps;

type StoryRefProps = {
  id?: string;
} & CommonProps;

export type StoryProps = StoryDefProps | StoryRefProps;

const inferInlineStories = (framework: string): boolean => {
  switch (framework) {
    case 'react':
      return true;
    default:
      return false;
  }
};

export const lookupStoryId = (
  storyName: string,
  { mdxStoryNameToKey, mdxComponentMeta }: DocsContextProps
) =>
  toId(
    mdxComponentMeta.id || mdxComponentMeta.title,
    storyNameFromExport(mdxStoryNameToKey[storyName])
  );

export const getStoryProps = (props: StoryProps, context: DocsContextProps): PureStoryProps => {
  const { id } = props as StoryRefProps;
  const { name } = props as StoryDefProps;
  const inputId = id === CURRENT_SELECTION ? context.id : id;
  const previewId = inputId || lookupStoryId(name, context);

  const { height, inline } = props;
  const data = context.storyStore.fromId(previewId);
  const { framework = null } = (data && data.parameters) || {};

  const docsParam = (data && data.parameters && data.parameters.docs) || {};

  if (docsParam.disable) {
    return null;
  }

  // prefer props, then global options, then framework-inferred values
  const {
    inlineStories = inferInlineStories(framework),
    iframeHeight = undefined,
    prepareForInline = undefined,
  } = docsParam;
  const { storyFn = undefined, name: storyName = undefined } = data || {};

  const storyIsInline = typeof inline === 'boolean' ? inline : inlineStories;
  if (storyIsInline && !prepareForInline && framework !== 'react') {
    throw new Error(
      `Story '${storyName}' is set to render inline, but no 'prepareForInline' function is implemented in your docs configuration!`
    );
  }

  return {
    inline: storyIsInline,
    id: previewId,
    storyFn: prepareForInline && storyFn ? () => prepareForInline(storyFn) : storyFn,
    height: height || (storyIsInline ? undefined : iframeHeight),
    title: storyName,
  };
};

const Story: FunctionComponent<StoryProps> = (props) => (
  <DocsContext.Consumer>
    {(context) => {
      const storyProps = getStoryProps(props, context);
      if (!storyProps) {
        return null;
      }
      return (
        <div id={storyBlockIdFromId(storyProps.id)}>
          <MDXProvider components={resetComponents}>
            <PureStory {...storyProps} />
          </MDXProvider>
        </div>
      );
    }}
  </DocsContext.Consumer>
);

Story.defaultProps = {
  children: null,
  name: null,
};

export { Story };
