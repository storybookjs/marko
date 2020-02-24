/* eslint-disable react/prop-types */
import React from 'react';

// We would need to add this in config.js idiomatically however that would make this file a bit confusing
import { addParameters } from '@storybook/react';

addParameters({ globalParameter: 'globalParameter' });

export default {
  title: 'Core/Parameters',
  parameters: {
    chapterParameter: 'chapterParameter',
  },
};

// I'm not sure what we should recommend regarding propTypes? are they a good idea for examples?
// Given we sort of control the props, should we export a prop type?
export const Passed = ({ parameters: { options, fileName, ...parameters }, ...rest }) => (
  <pre>Parameters: {JSON.stringify(parameters, null, 2)}</pre>
);
Passed.story = {
  name: 'passed to story',
  parameters: { storyParameter: 'storyParameter' },
};
