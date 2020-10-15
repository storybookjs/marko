import React, { Fragment, FunctionComponent } from 'react';
import semver from '@storybook/semver';
import { styled } from '@storybook/theming';
import { State } from '@storybook/api';
import Markdown from 'markdown-to-jsx';

import { StorybookIcon, SyntaxHighlighter, Link, DocumentWrapper } from '@storybook/components';

import SettingsFooter from './SettingsFooter';

const Header = styled.header(({ theme }) => ({
  marginBottom: 20,
  fontSize: theme.typography.size.m3,
  fontWeight: theme.typography.weight.black,
  alignItems: 'center',
  display: 'flex',

  '> svg': {
    height: 32,
    width: 'auto',
    marginRight: 8,
  },
}));

const Subheading = styled.span(({ theme }) => ({
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s2 - 1,
  lineHeight: '24px',
  color: theme.color.mediumdark,
}));

const SubheadingLink = styled(Link)(({ theme }) => ({
  fontSize: theme.typography.size.s1,
}));

const Subheader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '.75rem',
});

const UpdateMessage = styled.div<{ status: 'positive' | 'negative' | string }>(
  ({ status, theme }) => {
    if (status === 'positive') {
      return { background: theme.background.positive, color: theme.color.positive };
    }
    if (status === 'negative') {
      return { background: theme.background.negative, color: theme.color.negative };
    }
    return { background: '#EAF3FC', color: theme.color.darkest };
  },

  ({ theme }) => ({
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.s2,
    padding: '10px 20px',
    marginBottom: 24,
    borderRadius: theme.appBorderRadius,
    border: `1px solid ${theme.appBorderColor}`,
    textAlign: 'center',
  })
);

const ErrorMessage = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  textAlign: 'center',
}));

const Upgrade = styled.div(({ theme }) => ({
  marginTop: 20,
  borderTop: `1px solid ${theme.appBorderColor}`,
}));

const Container = styled.div({
  padding: `3rem 20px`,
  maxWidth: 600,
  margin: '0 auto',
});

const AboutScreen: FunctionComponent<{
  latest: State['versions']['latest'];
  current: State['versions']['current'];
}> = ({ latest = null, current }) => {
  const canUpdate = latest && semver.gt(latest.version, current.version);

  let updateMessage;
  if (latest) {
    if (canUpdate) {
      updateMessage = (
        <UpdateMessage status="positive">
          Storybook {latest.version} is available. Upgrade from {current.version} now.
        </UpdateMessage>
      );
    } else {
      updateMessage = (
        <UpdateMessage status="neutral">Looking good! You're up to date.</UpdateMessage>
      );
    }
  } else {
    updateMessage = (
      <UpdateMessage status="negative">
        Oops! The latest version of Storybook couldn't be fetched.
      </UpdateMessage>
    );
  }

  return (
    <Container>
      <Header>
        <StorybookIcon />
        Storybook {current.version}
      </Header>

      {updateMessage}

      {latest ? (
        <Fragment>
          <Subheader>
            <Subheading>{latest.version} Changelog</Subheading>
            <SubheadingLink
              secondary
              href="https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md"
              withArrow
              cancel={false}
              target="_blank"
            >
              Read full changelog
            </SubheadingLink>
          </Subheader>
          <DocumentWrapper>
            <Markdown>{latest.info.plain}</Markdown>
          </DocumentWrapper>
        </Fragment>
      ) : (
        <ErrorMessage>
          <Link
            href="https://github.com/storybookjs/storybook/releases"
            target="_blank"
            withArrow
            secondary
            cancel={false}
          >
            Check Storybook's release history
          </Link>
        </ErrorMessage>
      )}

      {canUpdate && (
        <Upgrade>
          <DocumentWrapper>
            <p>
              <b>Upgrade all Storybook packages to latest:</b>
            </p>
            <SyntaxHighlighter language="bash" copyable padded bordered>
              npx sb upgrade
            </SyntaxHighlighter>
          </DocumentWrapper>
        </Upgrade>
      )}

      <SettingsFooter />
    </Container>
  );
};

export { AboutScreen };
