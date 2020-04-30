import React from 'react';
import PropTypes from 'prop-types';

export default {
  title: 'addons/useGlobalArgs',
};

export const PassedToStory = ({ globalArgs }) => {
  return (
    <div>
      <h3>Global args:</h3>
      <pre>{JSON.stringify(globalArgs)}</pre>
    </div>
  );
};

PassedToStory.propTypes = {
  globalArgs: PropTypes.shape({}).isRequired,
};

export const SecondStory = ({ globalArgs }) => {
  return (
    <div>
      <h3>Global args (2):</h3>
      <pre>{JSON.stringify(globalArgs)}</pre>
    </div>
  );
};

SecondStory.propTypes = {
  globalArgs: PropTypes.shape({}).isRequired,
};
