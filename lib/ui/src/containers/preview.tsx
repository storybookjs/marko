import { PREVIEW_URL } from 'global';
import React from 'react';

import { Consumer, Combo } from '@storybook/api';

import { StoriesHash } from '@storybook/api/dist/modules/stories';
import { Preview } from '../components/preview/preview';

const nonAlphanumSpace = /[^a-z0-9 ]/gi;
const doubleSpace = /\s\s/gi;
const replacer = (match: string) => ` ${match} `;

const addExtraWhiteSpace = (input: string) =>
  input.replace(nonAlphanumSpace, replacer).replace(doubleSpace, ' ');

const getDescription = (storiesHash: StoriesHash, storyId: string) => {
  const storyInfo = storiesHash[storyId];

  if (storyInfo) {
    // @ts-ignore
    const { kind, name } = storyInfo;
    return kind && name ? addExtraWhiteSpace(`${kind} - ${name}`) : '';
  }

  return '';
};

const mapper = ({ api, state }: Combo) => {
  const { layout, location, customQueryParams, storiesHash, storyId } = state;
  const { parameters } = storiesHash[storyId] || {};
  return {
    api,
    getElements: api.getElements,
    options: layout,
    description: getDescription(storiesHash, storyId),
    ...api.getUrlState(),
    queryParams: customQueryParams,
    docsOnly: (parameters && parameters.docsOnly) as boolean,
    location,
    parameters,
  };
};

function getBaseUrl(): string {
  try {
    return PREVIEW_URL || 'iframe.html';
  } catch (e) {
    return 'iframe.html';
  }
}

const PreviewConnected = React.memo(props => (
  <Consumer filter={mapper}>
    {(fromState: ReturnType<typeof mapper>) => (
      <Preview
        {...props}
        baseUrl={getBaseUrl()}
        {...fromState}
        customCanvas={fromState.api.renderPreview}
      />
    )}
  </Consumer>
));
PreviewConnected.displayName = 'PreviewConnected';

export default PreviewConnected;
