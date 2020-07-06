import React, { FC } from 'react';

import { styled } from '@storybook/theming';
import { opacify, transparentize } from 'polished';

import { ControlProps, BooleanValue, BooleanConfig } from './types';

const Label = styled.label(({ theme }) => ({
  lineHeight: '20px',
  alignItems: 'center',
  marginBottom: 8,
  display: 'inline-block',
  position: 'relative',

  input: {
    appearance: 'none',
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    margin: 0,
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '3em',

    '&:focus': {
      outline: 'none',
      boxShadow: `${theme.color.secondary} 0 0 0 1px inset !important`,
    },
  },

  span: {
    minWidth: 60,
    textAlign: 'center',
    fontSize: theme.typography.size.s1,
    fontWeight: theme.typography.weight.bold,
    lineHeight: '1',
    cursor: 'pointer',
    display: 'inline-block',
    padding: '8px 16px',
    transition: 'all 150ms ease-out',
    userSelect: 'none',
    borderRadius: '3em',

    boxShadow: `${opacify(0.05, theme.appBorderColor)} 0 0 0 1px inset`,
    color: transparentize(0.4, theme.color.defaultText),
    background: 'transparent',

    '&:hover': {
      boxShadow: `${opacify(0.3, theme.appBorderColor)} 0 0 0 1px inset`,
    },

    '&:active': {
      boxShadow: `${opacify(0.05, theme.appBorderColor)} 0 0 0 2px inset`,
      color: opacify(1, theme.appBorderColor),
    },

    '&:first-of-type': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '&:last-of-type': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },

  'input:checked ~ span:first-of-type, input:not(:checked) ~ span:last-of-type': {
    background: `${opacify(0.05, theme.appBorderColor)}`,
    boxShadow: `transparent 0 0 0 1px inset`,
    color: theme.color.defaultText,
  },
}));

const format = (value: BooleanValue): string | null => (value ? String(value) : null);
const parse = (value: string | null) => value === 'true';

export type BooleanProps = ControlProps<BooleanValue> & BooleanConfig;
export const BooleanControl: FC<BooleanProps> = ({ name, value, onChange, onBlur, onFocus }) => (
  <Label htmlFor={name} title={value ? 'Change to false' : 'Change to true'}>
    <input
      id={name}
      type="checkbox"
      onChange={(e) => onChange(name, e.target.checked)}
      checked={value}
      {...{ name, onBlur, onFocus }}
    />
    <span>True</span>
    <span>False</span>
  </Label>
);
