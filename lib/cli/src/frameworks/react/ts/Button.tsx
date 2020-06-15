import React, { FunctionComponent, HTMLAttributes } from 'react';

const styles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
  margin: 10,
};

export type ButtonProps = HTMLAttributes<HTMLButtonElement>;
export const Button: FunctionComponent<ButtonProps> = ({ children, onClick }: ButtonProps) => (
  <button onClick={onClick} style={styles} type="button">
    {children}
  </button>
);

export default Button;
