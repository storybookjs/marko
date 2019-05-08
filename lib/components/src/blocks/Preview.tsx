import React from 'react';
import { IFrame } from './IFrame';

const BASE_URL = 'iframe.html';

export enum PreviewError {
  NO_STORY = 'no story',
}

interface InlinePreviewProps {
  title: string;
  height?: string;
  storyFn: () => React.ElementType;
}

interface IFramePreviewProps {
  title: string;
  height?: string;
  id: string;
}

// How do you XOR properties in typescript?
export interface PreviewProps {
  inline: boolean;
  title: string;
  height?: string;
  id?: string;
  storyFn?: () => React.ElementType;
  error?: PreviewError;
}

const InlinePreview: React.FunctionComponent<InlinePreviewProps> = ({ storyFn, title, height }) => (
  <div aria-labelledby={title} style={{ height }}>
    {storyFn()}
  </div>
);

const IFramePreview: React.FunctionComponent<IFramePreviewProps> = ({
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

const Preview: React.FunctionComponent<PreviewProps> = ({
  error,
  height,
  id,
  inline,
  storyFn,
  title,
}) => {
  if (error) {
    return <div>{error}</div>;
  }
  return inline ? (
    <InlinePreview title={title} height={height} storyFn={storyFn} />
  ) : (
    <IFramePreview id={id} title={title} height={height} />
  );
};

export { Preview };
