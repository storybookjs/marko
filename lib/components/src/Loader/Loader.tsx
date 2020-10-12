import { EventSource } from 'global';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { styled, keyframes } from '@storybook/theming';
import { rotate360 } from '../shared/animation';

const LoaderWrapper = styled.div<{ size?: number }>(({ size = 32 }) => ({
  borderRadius: '50%',
  cursor: 'progress',
  display: 'inline-block',
  overflow: 'hidden',
  position: 'absolute',
  transition: 'all 200ms ease-out',
  verticalAlign: 'top',
  top: '50%',
  left: '50%',
  marginTop: -(size / 2),
  marginLeft: -(size / 2),
  height: size,
  width: size,
  zIndex: 4,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'rgba(97, 97, 97, 0.29)',
  borderTopColor: 'rgb(100,100,100)',
  animation: `${rotate360} 0.7s linear infinite`,
  mixBlendMode: 'difference',
}));

const ProgressWrapper = styled.div({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

const ProgressTrack = styled.div(({ theme }) => ({
  position: 'relative',
  width: '80%',
  maxWidth: 300,
  height: 5,
  borderRadius: 5,
  background: `${theme.color.secondary}33`,
  overflow: 'hidden',
  cursor: 'progress',
}));

const ProgressBar = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  background: theme.color.secondary,
}));

const ProgressMessage = styled.div(({ theme }) => ({
  minHeight: '2em',
  marginTop: '0.75rem',
  fontSize: `${theme.typography.size.s1}px`,
  color: theme.barTextColor,
}));

const ellipsis = keyframes`
  from { content: "..." }
  33% { content: "." }
  66% { content: ".." }
  to { content: "..." }
`;

const Ellipsis = styled.span({
  '&::after': {
    content: "'...'",
    animation: `${ellipsis} 1s linear infinite`,
    display: 'inline-block',
    width: '1em',
    height: 'auto',
  },
});

interface LoaderProps {
  progress?: {
    value: number;
    message: string;
    modules?: {
      complete: number;
      total: number;
    };
  };
  size?: number;
}

export const PureLoader: FunctionComponent<LoaderProps> = ({ progress, size, ...props }) =>
  progress ? (
    <ProgressWrapper
      aria-label="Content is loading..."
      aria-live="polite"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress.value * 100}
      aria-valuetext={progress.message}
      role="progressbar"
      {...props}
    >
      <ProgressTrack>
        <ProgressBar style={{ width: `${progress.value * 100}%` }} />
      </ProgressTrack>
      <ProgressMessage>
        {progress.message}
        {progress.modules && ` ${progress.modules.complete} / ${progress.modules.total} modules`}
        {progress.value < 1 && <Ellipsis />}
      </ProgressMessage>
    </ProgressWrapper>
  ) : (
    <LoaderWrapper
      aria-label="Content is loading..."
      aria-live="polite"
      role="status"
      size={size}
      {...props}
    />
  );

export const Loader: FunctionComponent = (props) => {
  const [progress, setProgress] = useState(undefined);

  useEffect(() => {
    const eventSource = new EventSource('/progress');
    eventSource.onmessage = (event: any) => {
      try {
        setProgress(JSON.parse(event.data));
      } catch (e) {
        // do nothing
      }
    };
    return () => eventSource.close();
  }, []);

  return <PureLoader progress={progress} {...props} />;
};
