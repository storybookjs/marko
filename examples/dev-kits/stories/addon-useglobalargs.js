import React from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'addons/useGlobals',
};

export const PassedToStory = ({ globals }) => {
  return (
    <div>
      <h3>Global args:</h3>
      <pre>{JSON.stringify(globals)}</pre>
    </div>
  );
};

PassedToStory.propTypes = {
  globals: PropTypes.shape({}).isRequired,
};

export const SecondStory = ({ globals }) => {
  return (
    <div>
      <h3>Global args (2):</h3>
      <pre>{JSON.stringify(globals)}</pre>
    </div>
  );
};

SecondStory.propTypes = {
  globals: PropTypes.shape({}).isRequired,
};
