import React from 'react';

interface ButtonProps {
  variant: 'small' | 'large';
}

export const Button = (props: ButtonProps) => {
  const { variant } = props;
  return <button type="button">click me! {variant}</button>;
};

export default Button;
