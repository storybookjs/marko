import React from 'react';
import { toId } from '@storybook/router';
import { Story, StoryProps as PureStoryProps } from '@storybook/components';

import { DocsContext, DocsContextProps } from './DocsContext';

interface StoryProps {
  id?: string;
  name?: string;
  children?: React.ReactElement;
  height?: string;
}

export const getStoryProps = (
  { id, name, height }: StoryProps,
  { id: currentId, storyStore, parameters, mdxKind }: DocsContextProps
): PureStoryProps => {
  const previewId = id || (name && toId(mdxKind, name)) || currentId;
  const data = storyStore.fromId(previewId);
  const { inlineStories, iframeHeight } = (parameters &&
    parameters.options &&
    parameters.options.docs) || {
    inlineStories: false,
    iframeHeight: undefined,
  };
  return {
    inline: inlineStories,
    id: previewId,
    storyFn: data && data.getDecorated(),
    height: height || iframeHeight,
    title: data && data.name,
  };
};

const StoryContainer: React.FunctionComponent<StoryProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const storyProps = getStoryProps(props, context);
      return <Story {...storyProps} />;
    }}
  </DocsContext.Consumer>
);

StoryContainer.defaultProps = {
  children: null,
  name: null,
};

export { StoryContainer as Story };
