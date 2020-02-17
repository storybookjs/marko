import React from 'react';

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
export const Button: React.FC<ButtonProps> = ({ onClick }: ButtonProps) => (
  <button onClick={onClick} type="button">
    hello
  </button>
);

Button.defaultProps = {
  primary: true,
  secondary: false,
};

export const component = Button;
