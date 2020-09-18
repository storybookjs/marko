import React, { FC, ChangeEvent, useState, useCallback, useEffect } from 'react';
import { styled } from '@storybook/theming';

import deepEqual from 'fast-deep-equal';
import { Form } from '../form';
import { ControlProps, ObjectValue, ObjectConfig } from './types';
import { ArgType } from '../blocks';

const format = (value: any) => (value ? JSON.stringify(value) : '');

const parse = (value: string) => {
  const trimmed = value && value.trim();
  return trimmed ? JSON.parse(trimmed) : {};
};

const validate = (value: any, argType: ArgType) => {
  if (argType && argType.type.name === 'array') {
    return Array.isArray(value);
  }
  return true;
};

const Wrapper = styled.label({
  display: 'flex',
});

export type ObjectProps = ControlProps<ObjectValue> & ObjectConfig;
export const ObjectControl: FC<ObjectProps> = ({
  name,
  argType,
  value,
  onChange,
  onBlur,
  onFocus,
}) => {
  const [valid, setValid] = useState(true);
  const [text, setText] = useState(format(value));

  useEffect(() => {
    const newText = format(value);
    if (text !== newText) setText(newText);
  }, [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      try {
        const newVal = parse(e.target.value);
        const newValid = validate(newVal, argType);
        if (newValid && !deepEqual(value, newVal)) {
          onChange(newVal);
        }
        setValid(newValid);
      } catch (err) {
        setValid(false);
      }
      setText(e.target.value);
    },
    [onChange, setValid]
  );

  return (
    <Wrapper>
      <Form.Textarea
        valid={valid ? undefined : 'error'}
        value={text}
        onChange={handleChange}
        size="flex"
        placeholder="Adjust object dynamically"
        {...{ name, onBlur, onFocus }}
      />
    </Wrapper>
  );
};
