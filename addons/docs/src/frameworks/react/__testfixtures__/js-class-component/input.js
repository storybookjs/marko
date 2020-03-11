/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component description
 */
class ErrorBox extends React.Component {
  render() {
    const { children } = this.props;

    return <div className="error-box">{children}</div>;
  }
}

ErrorBox.propTypes = {
  /**
   * PropTypes description
   */
  children: PropTypes.node.isRequired,
};

export default ErrorBox;
export const component = ErrorBox;
