import React from 'react';
import { toId } from '@storybook/router';
import { Source, SourceProps as PureSourceProps, SourceError } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';

interface SourceProps {
  language?: string;
  code?: string;
  id?: string;
  name?: string;
}

interface Location {
  line: number;
  col: number;
}

interface StorySource {
  source: string;
  locationsMap: { [id: string]: { startBody: Location; endBody: Location } };
}

const extract = (targetId: string, { source, locationsMap }: StorySource) => {
  const { startBody: start, endBody: end } = locationsMap[targetId];
  const lines = source.split('\n');
  if (start.line === end.line) {
    return lines[start.line - 1].substring(start.col, end.col);
  }
  // NOTE: storysource locations are 1-based not 0-based!
  const startLine = lines[start.line - 1];
  const endLine = lines[end.line - 1];
  return [
    startLine.substring(start.col),
    ...lines.slice(start.line, end.line - 1),
    endLine.substring(0, end.col),
  ].join('\n');
};

export const getSourceProps = (
  { language, code, name, id }: SourceProps,
  { id: currentId, mdxKind, storyStore }: DocsContextProps
): PureSourceProps => {
  let source = code; // prefer user-specified code
  if (!source) {
    const targetId = id || (name && toId(mdxKind, name)) || currentId; // prefer user-specified story id
    const data = storyStore.fromId(targetId);
    if (data && data.parameters) {
      const { mdxSource, storySource } = data.parameters;
      source = mdxSource || (storySource && extract(targetId, storySource));
    }
  }
  return source
    ? { code: source, language: language || 'jsx' }
    : { error: SourceError.SOURCE_UNAVAILABLE };
};

/**
 * Story source doc block renders source code if provided,
 * or the source for a story if `storyId` is provided, or
 * the source for the current story if nothing is provided.
 */
const SourceContainer: React.FunctionComponent<SourceProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const sourceProps = getSourceProps(props, context);
      return <Source {...sourceProps} />;
    }}
  </DocsContext.Consumer>
);

export { SourceContainer as Source };
