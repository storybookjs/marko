import { ParameterEnhancer, combineParameters } from '@storybook/client-api';

interface Location {
  line: number;
  col: number;
}

interface StorySource {
  source: string;
  locationsMap: { [id: string]: { startBody: Location; endBody: Location } };
}

const extract = (targetId: string, { source, locationsMap }: StorySource) => {
  if (!locationsMap) {
    return source;
  }
  const location = locationsMap[targetId];

  // FIXME: bad locationsMap generated for module export functions whose titles are overridden
  if (!location) return null;
  const { startBody: start, endBody: end } = location;
  const lines = source.split('\n');
  if (start.line === end.line && lines[start.line - 1] !== undefined) {
    return lines[start.line - 1].substring(start.col, end.col);
  }
  // NOTE: storysource locations are 1-based not 0-based!
  const startLine = lines[start.line - 1];
  const endLine = lines[end.line - 1];
  if (startLine === undefined || endLine === undefined) {
    return source;
  }
  return [
    startLine.substring(start.col),
    ...lines.slice(start.line, end.line - 1),
    endLine.substring(0, end.col),
  ].join('\n');
};

export const enhanceSource: ParameterEnhancer = context => {
  const { id, parameters } = context;
  const { storySource, docs = {} } = parameters;
  const { formatSource } = docs;

  // no input or user has manually overridden the output
  if (!storySource?.source || docs.source?.code) {
    return null;
  }

  const input = extract(id, storySource);
  const code = formatSource ? formatSource(input, id) : input;

  return { docs: combineParameters(docs, { source: { code } }) };
};
