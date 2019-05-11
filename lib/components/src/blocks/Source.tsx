import React from 'react';

import { SyntaxHighlighter } from '../syntaxhighlighter/syntaxhighlighter';

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
    return (
      <SyntaxHighlighter bordered language="bash">
        {error}
      </SyntaxHighlighter>
    );
  }
  return (
    <SyntaxHighlighter bordered copyable language={language}>
      {code}
    </SyntaxHighlighter>
  );
};

export { Source };
