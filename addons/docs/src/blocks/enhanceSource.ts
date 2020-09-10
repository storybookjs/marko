import { combineParameters } from '@storybook/client-api';
import { StoryContext, Parameters } from '@storybook/addons';
import { extractSource, LocationsMap } from '@storybook/source-loader/extract-source';

interface StorySource {
  source: string;
  locationsMap: LocationsMap;
}

/**
 * Replaces full story id name like: story-kind--story-name -> story-name
 * @param id
 */
const storyIdToSanitizedStoryName = (id: string) => id.replace(/^.*?--/, '');

const extract = (targetId: string, { source, locationsMap }: StorySource) => {
  if (!locationsMap) {
    return source;
  }

  const sanitizedStoryName = storyIdToSanitizedStoryName(targetId);
  const location = locationsMap[sanitizedStoryName];
  const lines = source.split('\n');

  return extractSource(location, lines);
};

export const enhanceSource = (context: StoryContext): Parameters => {
  const { id, parameters } = context;
  const { storySource, docs = {} } = parameters;
  const { transformSource } = docs;

  // no input or user has manually overridden the output
  if (!storySource?.source || docs.source?.code) {
    return null;
  }

  const input = extract(id, storySource);
  const code = transformSource ? transformSource(input, context) : input;

  return { docs: combineParameters(docs, { source: { code } }) };
};
