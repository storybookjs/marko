import React, { FC, ChangeEvent, useState, useCallback } from 'react';
import deepEqual from 'fast-deep-equal';
import { Form } from '../form';
import { ControlProps, ObjectValue, ObjectConfig } from './types';

const format = (value: any) => (value ? JSON.stringify(value) : '');

const parse = (value: string) => {
  const trimmed = value && value.trim();
  return trimmed ? JSON.parse(trimmed) : {};
};

export type ObjectProps = ControlProps<ObjectValue> & ObjectConfig;
export const ObjectControl: FC<ObjectProps> = ({ name, value, onChange }) => {
  const [valid, setValid] = useState(true);
  const [text, setText] = useState(format(value));

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      try {
        const newVal = parse(e.target.value);
        if (!deepEqual(value, newVal)) {
          onChange(name, newVal);
        }
        setValid(true);
      } catch (err) {
        setValid(false);
      }
      setText(e.target.value);
    },
    [onChange, setValid]
  );

  return (
    <Form.Textarea
      name={name}
      valid={valid ? undefined : 'error'}
      value={text}
      onChange={handleChange}
      size="flex"
    />
  );
};
