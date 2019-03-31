import React from 'react';
import PropTypes from 'prop-types';

export const Story = ({ children }) => <div>{children}</div>;

Story.defaultProps = {
  children: null,
};

Story.propTypes = {
  children: PropTypes.node,
};
