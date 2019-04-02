import React from 'react';
import PropTypes from 'prop-types';
import { PropTable } from '@storybook/components';

export const Info = ({ context }) => {
  const {
    parameters: { component },
  } = context;
  if (component && component.propDefinitions) {
    return <PropTable propDefinitions={component.propDefinitions} />;
  }
  return <div>No info</div>;
};

Info.propTypes = {
  context: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
