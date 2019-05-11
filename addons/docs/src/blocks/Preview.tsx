import React from 'react';
import { toId } from '@storybook/router';
import { Preview, PreviewProps as PurePreviewProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';

interface PreviewProps {
  id?: string;
  height?: string;
}

export const getPreviewProps = (
  { id, height }: PreviewProps,
  { storyStore, parameters, selectedKind, selectedStory }: DocsContextProps
): PurePreviewProps => {
  const previewId = id || toId(selectedKind, selectedStory);
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

const PreviewContainer: React.FunctionComponent<PreviewProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const previewProps = getPreviewProps(props, context);
      return <Preview {...previewProps} />;
    }}
  </DocsContext.Consumer>
);

export { PreviewContainer as Preview };
