import React from 'react';
import { SyntaxHighlighter } from '../syntaxhighlighter/syntaxhighlighter';

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
    <SyntaxHighlighter bordered copyable language={language}>
      {code}
    </SyntaxHighlighter>
  );
};

export { Source };
