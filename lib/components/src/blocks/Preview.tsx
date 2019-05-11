import React from 'react';
import { styled } from '@storybook/theming';

import { IFrame } from './IFrame';

const BASE_URL = 'iframe.html';

const StyledPreviewWrapper = styled.div(({ theme }) => ({
  borderRadius: theme.appBorderRadius,
  background: theme.background.content,
  margin: '1.5rem 0 2.5rem',
  boxShadow: 'rgba(0, 0, 0, 0.10) 0 2px 5px 0',
  padding: 20,
  display: 'flex',
  alignItems: 'center',
}));

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
  <StyledPreviewWrapper aria-labelledby={title} style={{ height }} className="docblock-preview">
    {storyFn()}
  </StyledPreviewWrapper>
);

const IFramePreview: React.FunctionComponent<IFramePreviewProps> = ({
  id,
  title,
  height = '500px',
}) => (
  <StyledPreviewWrapper style={{ width: '100%', height }} className="docblock-preview">
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
  </StyledPreviewWrapper>
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
