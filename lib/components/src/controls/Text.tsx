import React, { FC, ChangeEvent } from 'react';

import { Form } from '../form';
import { ControlProps, TextValue, TextConfig } from './types';

export type TextProps = ControlProps<TextValue> & TextConfig;

export const TextControl: FC<TextProps> = ({ name, value, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(name, event.target.value);
  };
  return <Form.Textarea id={name} name={name} value={value} onChange={handleChange} size="flex" />;
};
