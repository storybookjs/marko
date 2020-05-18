import React, { FC, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A label to show on the button
   */
  label: string;
}

export const Button = ({ label }: ButtonProps) => <button type="button">{label}</button>;
