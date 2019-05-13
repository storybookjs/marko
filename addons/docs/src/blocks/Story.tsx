import React from 'react';
import PropTypes from 'prop-types';
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
  { storyStore, parameters, mdxKind, selectedKind, selectedStory }: DocsContextProps
): PureStoryProps => {
  const previewId = id || (name && toId(mdxKind, name)) || toId(selectedKind, selectedStory);
  const data = storyStore.fromId(previewId);
  const props = { height, title: data && data.name };
  const { inlineStories } = (parameters && parameters.options && parameters.options.docs) || {
    inlineStories: false,
  };
  return {
    inline: inlineStories,
    id: previewId,
    storyFn: data.getDecorated(),
    height,
    title: data.name,
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
