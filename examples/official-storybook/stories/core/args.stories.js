import React from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'Core/Args',
  parameters: {
    passArgsFirst: true,
  },
};

export const PassedToStory = ({ name }) => <pre>The value of the name field is {name}</pre>;

PassedToStory.story = {
  parameters: { argTypes: { name: { defaultValue: 'initial' } } },
};

PassedToStory.propTypes = {
  name: PropTypes.string.isRequired,
};
