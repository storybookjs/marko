import React, { FC } from 'react';

import { styled } from '@storybook/theming';
import { ControlProps, BooleanValue, BooleanConfig } from './types';

const Input = styled.input({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'top',
  height: 21,
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  color: '#555',
});

const format = (value: BooleanValue): string | null => (value ? String(value) : null);
const parse = (value: string | null) => value === 'true';

export type BooleanProps = ControlProps<BooleanValue> & BooleanConfig;
export const BooleanControl: FC<BooleanProps> = ({ name, value, onChange }) => (
  <Input
    id={name}
    name={name}
    type="checkbox"
    onChange={(e) => onChange(name, e.target.checked)}
    checked={value}
  />
);
