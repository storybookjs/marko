import { document } from 'global';
import React from 'react';

export default {
  title: 'Addons/QueryParams',

  parameters: {
    query: {
      mock: true,
    },
  },
};

export const MockIsTrue = () => (
  <div>This story should have an extra url query param: {document.location.search}</div>
);

MockIsTrue.storyName = 'mock is true';

export const MockIs4 = () => (
  <div>This story should have an extra url query param: {document.location.search}</div>
);

MockIs4.storyName = 'mock is 4';
MockIs4.parameters = { query: { mock: 4 } };
