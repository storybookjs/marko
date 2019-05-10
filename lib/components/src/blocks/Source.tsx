import React from 'react';
import { styled } from '@storybook/theming';

import { SyntaxHighlighter } from '../syntaxhighlighter/syntaxhighlighter';

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
}));

export enum SourceError {
  NO_STORY = 'no story',
  SOURCE_UNAVAILABLE = 'source unavailable',
}

export interface SourceProps {
  language?: string;
  code?: string;
  error?: SourceError;
}

const Source: React.FunctionComponent<SourceProps> = ({ language, code, error = null }) => {
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <StyledSyntaxHighlighter bordered copyable language={language}>
      {code}
    </StyledSyntaxHighlighter>
  );
};

export { Source };
