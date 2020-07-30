import React, { FunctionComponent, useEffect, useState, Fragment, ComponentProps } from 'react';
import { styled } from '@storybook/theming';
import { Icons, Loader } from '@storybook/components';

const Centered = styled.div({
  top: '50%',
  position: 'absolute',
  transform: 'translateY(-50%)',
  width: '100%',
  textAlign: 'center',
});

const LoaderWrapper = styled.div({
  position: 'relative',
  height: '32px',
});

const Message = styled.div(({ theme }) => ({
  paddingTop: '12px',
  color: theme.color.mediumdark,
  maxWidth: '295px',
  margin: '0 auto',
  fontSize: `${theme.typography.size.s1}px`,
  lineHeight: `16px`,
}));

const Iframe = styled.iframe<{ isLoaded: boolean }>(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: 0,
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
  },
  ({ isLoaded }) => ({ visibility: isLoaded ? 'visible' : 'hidden' })
);

const AlertIcon = styled(((props) => <Icons icon="alert" {...props} />) as FunctionComponent<
  Omit<ComponentProps<typeof Icons>, 'icon'>
>)(({ theme }) => ({
  color: theme.color.mediumdark,
  width: 40,
  margin: '0 auto',
}));

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
    <AlertIcon />
    <Message>
      The release notes couldn't be loaded. Check your internet connection and try again.
    </Message>
  </Centered>
);

export interface ReleaseNotesProps {
  didHitMaxWaitTime: boolean;
  isLoaded: boolean;
  setLoaded: (isLoaded: boolean) => void;
  version: string;
}

const PureReleaseNotesScreen: FunctionComponent<ReleaseNotesProps> = ({
  didHitMaxWaitTime,
  isLoaded,
  setLoaded,
  version,
}) => (
  <Fragment>
    {!isLoaded && !didHitMaxWaitTime && <ReleaseNotesLoader />}
    {didHitMaxWaitTime ? (
      <MaxWaitTimeMessaging />
    ) : (
      <Iframe
        isLoaded={isLoaded}
        onLoad={() => setLoaded(true)}
        src={getIframeUrl(version)}
        title={`Release notes for Storybook version ${version}`}
      />
    )}
  </Fragment>
);

const MAX_WAIT_TIME = 10000; // 10 seconds

const ReleaseNotesScreen: FunctionComponent<Omit<
  ReleaseNotesProps,
  'isLoaded' | 'setLoaded' | 'didHitMaxWaitTime'
>> = ({ version }) => {
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
      version={version}
    />
  );
};

export { ReleaseNotesScreen, PureReleaseNotesScreen };
