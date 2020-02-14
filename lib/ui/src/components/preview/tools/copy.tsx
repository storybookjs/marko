import React from 'react';
import copy from 'copy-to-clipboard';
import { IconButton, Icons } from '@storybook/components';
import { Consumer, Combo } from '@storybook/api';
import { Addon } from '@storybook/addons';
import { stringifyQueryParams } from '../utils/stringifyQueryParams';

const copyMapper = ({ state }: Combo) => ({
  origin: state.location.origin,
  pathname: state.location.pathname,
  storyId: state.storyId,
  baseUrl: 'iframe.html',
  queryParams: state.customQueryParams,
});

export const copyTool: Addon = {
  title: 'copy',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={copyMapper}>
      {({ baseUrl, storyId, origin, pathname, queryParams }: ReturnType<typeof copyMapper>) => (
        <IconButton
          key="copy"
          onClick={() =>
            copy(`${origin}${pathname}${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`)
          }
          title="Copy canvas link"
        >
          <Icons icon="copy" />
        </IconButton>
      )}
    </Consumer>
  ),
};
