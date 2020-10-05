import { PREVIEW_URL } from 'global';
import React from 'react';

import { Consumer, Combo, StoriesHash, isRoot, isGroup, isStory } from '@storybook/api';

import { Preview } from '../components/preview/preview';

export type Item = StoriesHash[keyof StoriesHash];

const splitTitleAddExtraSpace = (input: string) =>
  input.split('/').join(' / ').replace(/\s\s/, ' ');

const getDescription = (item: Item) => {
  if (isRoot(item)) {
    return item.name ? `${item.name} ⋅ Storybook` : 'Storybook';
  }
  if (isGroup(item)) {
    return item.name ? `${item.name} ⋅ Storybook` : 'Storybook';
  }
  if (isStory(item)) {
    const { kind, name } = item;
    return kind && name ? splitTitleAddExtraSpace(`${kind} - ${name} ⋅ Storybook`) : 'Storybook';
  }

  return 'Storybook';
};

const mapper = ({ api, state }: Combo) => {
  const { layout, location, customQueryParams, storyId, refs, viewMode, path, refId } = state;
  const story = api.getData(storyId, refId);
  const docsOnly = story && story.parameters ? !!story.parameters.docsOnly : false;

  return {
    api,
    story,
    options: layout,
    description: getDescription(story),
    viewMode,
    path,
    refs,
    baseUrl: PREVIEW_URL || 'iframe.html',
    queryParams: customQueryParams,
    docsOnly,
    location,
  };
};

const PreviewConnected = React.memo<{ id: string; withLoader: boolean }>((props) => (
  <Consumer filter={mapper}>{(fromState) => <Preview {...props} {...fromState} />}</Consumer>
));

export default PreviewConnected;
