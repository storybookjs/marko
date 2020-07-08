import React, { FunctionComponent, useEffect, useState } from 'react';
import { color, styled, typography } from '@storybook/theming';
import { Icons, Loader } from '@storybook/components';
import { GlobalHotKeys } from 'react-hotkeys';

export const Centered = styled.div({
  top: '50%',
  position: 'absolute',
  transform: 'translateY(-50%)',
  width: '100%',
  textAlign: 'center',
});

export const LoaderWrapper = styled.div({
  position: 'relative',
  height: '32px',
});

export const Message = styled.div({
  paddingTop: '12px',
  color: color.mediumdark,
  maxWidth: '295px',
  margin: '0 auto',
  fontSize: `${typography.size.s1}px`,
  lineHeight: `16px`,
});

export const Iframe = styled.iframe({
  border: 0,
  width: '100%',
  height: '100%',
});

const getIframeUrl = (version: string) => {
  const [major, minor] = version.split('.');
  return `https://storybook.js.org/releases/iframe/${major}.${minor}`;
};

const ReleaseNotesLoader: FunctionComponent = () => (
  <Centered>
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
    <Message>Loading release notes</Message>
  </Centered>
);

const MaxWaitTimeMessaging: FunctionComponent = () => (
  <Centered>
    <Icons icon="alert" style={{ color: color.mediumdark, width: '40px', margin: '0 auto' }} />
    <Message>
      The release notes couldn't be loaded. Check your internet connection and try again.
    </Message>
  </Centered>
);

const keyMap = {
  CLOSE: 'escape',
};

export interface ReleaseNotesProps {
  didHitMaxWaitTime: boolean;
  isLoaded: boolean;
  onClose: () => void;
  setLoaded: (isLoaded: boolean) => void;
  version: string;
}

const PureReleaseNotesScreen: FunctionComponent<ReleaseNotesProps> = ({
  didHitMaxWaitTime,
  isLoaded,
  onClose,
  setLoaded,
  version,
}) => (
  <GlobalHotKeys handlers={{ CLOSE: onClose }} keyMap={keyMap}>
    {!isLoaded && !didHitMaxWaitTime && <ReleaseNotesLoader />}
    {didHitMaxWaitTime ? (
      <MaxWaitTimeMessaging />
    ) : (
      <Iframe
        style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
        onLoad={() => setLoaded(true)}
        src={getIframeUrl(version)}
        title={`Release notes for Storybook version ${version}`}
      />
    )}
  </GlobalHotKeys>
);

const MAX_WAIT_TIME = 10000; // 10 seconds

const ReleaseNotesScreen: FunctionComponent<Omit<
  ReleaseNotesProps,
  'isLoaded' | 'setLoaded' | 'didHitMaxWaitTime'
>> = (props) => {
  const [isLoaded, setLoaded] = useState(false);
  const [didHitMaxWaitTime, setDidHitMaxWaitTime] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => !isLoaded && setDidHitMaxWaitTime(true), MAX_WAIT_TIME);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  return (
    <PureReleaseNotesScreen
      didHitMaxWaitTime={didHitMaxWaitTime}
      isLoaded={isLoaded}
      setLoaded={setLoaded}
      {...props}
    />
  );
};

export { ReleaseNotesScreen, PureReleaseNotesScreen };
