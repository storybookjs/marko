import React from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'Core/State',
};

export const PassedToStory = ({ state: { name } }) => (
  <pre>The value of the name field is {name}</pre>
);

PassedToStory.propTypes = {
  state: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};
