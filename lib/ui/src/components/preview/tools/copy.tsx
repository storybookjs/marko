import React from 'react';
import copy from 'copy-to-clipboard';
import { IconButton, Icons } from '@storybook/components';
import { Consumer, Combo } from '@storybook/api';
import { Addon } from '@storybook/addons';
import { stringifyQueryParams } from '../utils/stringifyQueryParams';

const copyMapper = ({ state, api }: Combo) => {
  const story = api.getData(state.storyId);
  const ref = story ? api.getRefs()[story && story.refId] : undefined;

  const { refId, id } = story || {};
  const storyId = refId ? `${refId}_${id}` : id;

  return {
    baseUrl: ref
      ? `${ref.url}/iframe.html`
      : `${state.location.origin + state.location.pathname}iframe.html`,
    storyId,
    queryParams: state.customQueryParams,
  };
};

export const copyTool: Addon = {
  title: 'copy',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={copyMapper}>
      {({ baseUrl, storyId, queryParams }) =>
        storyId ? (
          <IconButton
            key="copy"
            onClick={() => copy(`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`)}
            title="Copy canvas link"
          >
            <Icons icon="copy" />
          </IconButton>
        ) : null
      }
    </Consumer>
  ),
};
