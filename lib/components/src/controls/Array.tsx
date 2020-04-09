import React, { FC, ChangeEvent } from 'react';

import { Form } from '../form';
import { ControlProps, ArrayValue, ArrayConfig } from './types';

const parse = (value: string, separator: string): ArrayValue =>
  !value || value.trim() === '' ? [] : value.split(separator);

const format = (value: ArrayValue, separator: string) => {
  return value ? value.join(separator) : '';
};

export type ArrayProps = ControlProps<ArrayValue> & ArrayConfig;
export const ArrayControl: FC<ArrayProps> = ({ name, value, onChange, separator = ',' }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const { value: newVal } = e.target as HTMLTextAreaElement;
    onChange(name, parse(newVal, separator));
  };

  return (
    <Form.Textarea
      id={name}
      name={name}
      value={format(value, separator)}
      onChange={handleChange}
      size="flex"
    />
  );
};
