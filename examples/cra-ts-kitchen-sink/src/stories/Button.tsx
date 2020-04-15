import React, { FunctionComponent } from 'react';

interface ButtonProps {
  /**
   * Simple click handler
   */
  onClick?: () => void;

  /**
   * Is primary?
   */
  primary?: boolean;

  /**
   * default is false
   */
  secondary?: boolean;
}

/**
 * The world's most _basic_ button
 */
export const Button: FunctionComponent<ButtonProps> = ({ children, onClick }) => (
  <button onClick={onClick} type="button">
    {children}
  </button>
);

Button.defaultProps = {
  primary: true,
  secondary: false,
};
