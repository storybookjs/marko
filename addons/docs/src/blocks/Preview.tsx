import React from 'react';
import PropTypes from 'prop-types';

import { toId } from '@storybook/router';
import { IFrame } from './IFrame';
import { DocsContext } from './DocsContext';

const BASE_URL = 'iframe.html';

interface PreviewProps {
  id?: string;
  height?: string;
}

interface InlinePreviewProps {
  storyFn: () => React.ElementType;
  title: string;
  height?: string;
}

interface IFramePreviewProps {
  id: string;
  title: string;
  height?: string;
}

export const InlinePreview: React.FunctionComponent<InlinePreviewProps> = ({
  storyFn,
  title,
  height,
}) => (
  <div aria-labelledby={title} style={{ height }}>
    {storyFn()}
  </div>
);

export const IFramePreview: React.FunctionComponent<IFramePreviewProps> = ({
  id,
  title,
  height = '500px',
}) => (
  <div style={{ width: '100%', height }}>
    <IFrame
      key="iframe"
      id={`storybook-preview-${id}`}
      title={title}
      src={`${BASE_URL}?id=${id}`}
      allowFullScreen
      scale={1}
      style={{
        width: '100%',
        height: '100%',
        border: '0 none',
      }}
    />
  </div>
);

export const Preview: React.FunctionComponent<PreviewProps> = ({ id, height }) => (
  <DocsContext.Consumer>
    {({ storyStore, parameters, selectedKind, selectedStory }) => {
      const previewId = id || toId(selectedKind, selectedStory);
      const data = storyStore.fromId(previewId);
      const props = { height, title: data.name };
      const { inlineStories } = (parameters && parameters.options && parameters.options.docs) || {
        inlineStories: false,
      };
      return inlineStories ? (
        <InlinePreview storyFn={data.getDecorated()} {...props} />
      ) : (
        <IFramePreview id={previewId} {...props} />
      );
    }}
  </DocsContext.Consumer>
);
