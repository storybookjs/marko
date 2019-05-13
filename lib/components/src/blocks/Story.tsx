import React from 'react';
import { styled } from '@storybook/theming';

import { IFrame } from './IFrame';
import { EmptyBlock } from './EmptyBlock';

const BASE_URL = 'iframe.html';

export enum StoryError {
  NO_STORY = 'No component or story to display',
}

interface InlineStoryProps {
  title: string;
  height?: string;
  storyFn: () => React.ElementType;
}

interface IFrameStoryProps {
  title: string;
  height?: string;
  id: string;
}

// How do you XOR properties in typescript?
export interface StoryProps {
  inline: boolean;
  title: string;
  height?: string;
  id?: string;
  storyFn?: () => React.ElementType;
  error?: StoryError;
}

const StyledStoryWrapper = styled.div(({ theme }) => ({
  borderRadius: theme.appBorderRadius,
  background: theme.background.content,
  margin: '1.5rem 0 2.5rem',
  boxShadow:
    theme.base === 'light' ? 'rgba(0, 0, 0, 0.10) 0 1px 3px 0' : 'rgba(0, 0, 0, 0.20) 0 2px 5px 0',
  border: `1px solid ${theme.appBorderColor}`,
  padding: 20,
  display: 'flex',
  alignItems: 'center',
}));

const InlineStory: React.FunctionComponent<InlineStoryProps> = ({ storyFn, title, height }) => (
  <StyledStoryWrapper aria-labelledby={title} style={{ height }} className="docblock-Story">
    {storyFn()}
  </StyledStoryWrapper>
);

const IFrameStory: React.FunctionComponent<IFrameStoryProps> = ({
  id,
  title,
  height = '500px',
}) => (
  <StyledStoryWrapper className="docblock-Story">
    <div style={{ width: '100%', height }}>
      <IFrame
        key="iframe"
        id={`storybook-Story-${id}`}
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
  </StyledStoryWrapper>
);

const Story: React.FunctionComponent<StoryProps> = ({
  error,
  height,
  id,
  inline,
  storyFn,
  title,
}) => {
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }
  return inline ? (
    <InlineStory title={title} height={height} storyFn={storyFn} />
  ) : (
    <IFrameStory id={id} title={title} height={height} />
  );
};

export { Story };
