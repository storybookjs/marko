import React from 'react';
import PropTypes from 'prop-types';

const baseStyles = {
  fontFamily: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontWeight: 700,

  border: 0,
  borderRadius: '3em',
  cursor: 'pointer',
  display: 'inline-block',
  lineHeight: 1,
};

const modeStyles = {
  primary: {
    color: 'white',
    backgroundColor: '#1EA7FD',
  },
  secondary: {
    color: '#333',
    backgroundColor: 'transparent',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset',
  },
};

const sizeStyles = {
  small: {
    fontSize: '12px',
    padding: '10px 16px',
  },
  medium: {
    fontSize: '14px',
    padding: '11px 20px',
  },
  large: {
    fontSize: '16px',
    padding: '12px 24px',
  },
};

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, size, label, ...props }) => (
  <button
    type="button"
    style={{
      ...baseStyles,
      ...modeStyles[primary ? 'primary' : 'secondary'],
      ...sizeStyles[size],
      ...(backgroundColor && { backgroundColor }),
    }}
    {...props}
  >
    {label}
  </button>
);

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(Object.keys(sizeStyles)),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};
