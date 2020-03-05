import React from 'react';
import { IconButton, Icons } from '@storybook/components';
import { Consumer, Combo } from '@storybook/api';
import { Addon } from '@storybook/addons';
import { stringifyQueryParams } from '../utils/stringifyQueryParams';

const ejectMapper = ({ state, api }: Combo) => {
  const story = api.getData(state.storyId);
  const ref = api.getRefs()[story && story.refId];

  return {
    baseUrl: ref ? `${ref.url}/iframe.html` : 'iframe.html',
    storyId: story ? story.knownAs || story.id : null,
    queryParams: state.customQueryParams,
  };
};

export const ejectTool: Addon = {
  title: 'eject',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={ejectMapper}>
      {({ baseUrl, storyId, queryParams }) =>
        storyId ? (
          <IconButton
            key="opener"
            href={`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`}
            target="_blank"
            title="Open canvas in new tab"
          >
            <Icons icon="share" />
          </IconButton>
        ) : null
      }
    </Consumer>
  ),
};
