import React from 'react';
import { Source, SourceProps as PureSourceProps, SourceError } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';

interface SourceProps {
  language?: string;
  code?: string;
}

export const getSourceProps = (
  { language, code }: SourceProps,
  { parameters }: DocsContextProps
): PureSourceProps => {
  const source = code || (parameters && parameters.source);
  return source
    ? { code: source, language: language || 'jsx' }
    : { error: SourceError.SOURCE_UNAVAILABLE };
};

const SourceContainer: React.FunctionComponent<SourceProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const sourceProps = getSourceProps(props, context);
      return <Source {...sourceProps} />;
    }}
  </DocsContext.Consumer>
);

export { SourceContainer as Source };
