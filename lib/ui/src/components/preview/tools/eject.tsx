import React from 'react';
import { IconButton, Icons } from '@storybook/components';
import { Consumer, Combo } from '@storybook/api';
import { Addon } from '@storybook/addons';
import { stringifyQueryParams } from '../utils/stringifyQueryParams';

const ejectMapper = ({ state }: Combo) => ({
  baseUrl: 'iframe.html',
  storyId: state.storyId,
  queryParams: state.customQueryParams,
});

export const ejectTool: Addon = {
  title: 'eject',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={ejectMapper}>
      {({ baseUrl, storyId, queryParams }) => (
        <IconButton
          key="opener"
          href={`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`}
          target="_blank"
          title="Open canvas in new tab"
        >
          <Icons icon="share" />
        </IconButton>
      )}
    </Consumer>
  ),
};
