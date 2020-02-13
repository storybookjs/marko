import { PREVIEW_URL } from 'global';
import React from 'react';

import { Consumer, Combo, StoriesHash, isRoot, isGroup, isStory } from '@storybook/api';

import { Preview } from '../components/preview/preview';
import { PreviewProps } from '../components/preview/utils/types';

type Item = StoriesHash[keyof StoriesHash];

const nonAlphanumSpace = /[^a-z0-9 ]/gi;
const doubleSpace = /\s\s/gi;
const replacer = (match: string) => ` ${match} `;

const addExtraWhiteSpace = (input: string) =>
  input.replace(nonAlphanumSpace, replacer).replace(doubleSpace, ' ');

const getDescription = (item: Item) => {
  if (isRoot(item)) {
    return item.name ? `${item.name} ⋅ Storybook` : 'Storybook';
  }
  if (isGroup(item)) {
    return item.name ? `${item.name} ⋅ Storybook` : 'Storybook';
  }
  if (isStory(item)) {
    const { kind, name } = item;
    return kind && name ? addExtraWhiteSpace(`${kind} - ${name} ⋅ Storybook`) : 'Storybook';
  }

  return 'Storybook';
};

const mapper = ({ api, state }: Combo) => {
  const { layout, location, customQueryParams, storyId, refs, viewMode, path } = state;
  const story = api.getData(storyId);
  const docsOnly = story && story.parameters ? !!story.parameters.docsOnly : false;

  return {
    api,
    story,
    options: layout,
    description: getDescription(story),
    viewMode,
    path,
    refs,
    queryParams: customQueryParams,
    docsOnly,
    location,
  };
};

const getBaseUrl = (): string => {
  try {
    return PREVIEW_URL || 'iframe.html';
  } catch (e) {
    return 'iframe.html';
  }
};

const PreviewConnected = React.memo<{ id: string; withLoader: boolean }>(props => (
  <Consumer filter={mapper}>
    {(fromState: ReturnType<typeof mapper>) => {
      const p: PreviewProps = {
        ...props,
        baseUrl: getBaseUrl(),
        ...fromState,
      };

      return <Preview {...p} />;
      return <pre>{JSON.stringify(p, null, 2)}</pre>;
    }}
  </Consumer>
));
PreviewConnected.displayName = 'PreviewConnected';

export default PreviewConnected;
