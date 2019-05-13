import React from 'react';
import { styled } from '@storybook/theming';
import { EmptyBlock } from './EmptyBlock';

import { SyntaxHighlighter } from '../syntaxhighlighter/syntaxhighlighter';

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)(({ theme }) => ({
  // DocBlocks-specific styling and overrides
  boxShadow: 'rgba(0, 0, 0, 0.10) 0 2px 5px 0',
  margin: '25px 0 40px',

  'pre.hljs': {
    padding: 20,
  },
}));

export enum SourceError {
  NO_STORY = 'There\u2019s no story here.',
  SOURCE_UNAVAILABLE = 'Oh no! The source is not available.',
}

export interface SourceProps {
  language?: string;
  code?: string;
  error?: SourceError;
}

const Source: React.FunctionComponent<SourceProps> = ({ language, code, error = null }) => {
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }
  return (
    <StyledSyntaxHighlighter bordered copyable language={language} className="docblock-source">
      {code}
    </StyledSyntaxHighlighter>
  );
};

export { Source };
