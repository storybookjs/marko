import React, { FC, ChangeEvent } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '../form';
import { ControlProps, NumberValue, NumberConfig } from './types';

const Wrapper = styled.label({
  display: 'flex',
});

type NumberProps = ControlProps<NumberValue | null> & NumberConfig;

export const parse = (value: string) => {
  const result = parseFloat(value);
  return Number.isNaN(result) ? null : result;
};

export const format = (value: NumberValue) => (value != null ? String(value) : '');

export const NumberControl: FC<NumberProps> = ({ name, value, onChange, min, max, step }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(name, parse(event.target.value));
  };

  return (
    <Wrapper>
      <Form.Input
        value={value}
        type="number"
        name={name}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        size="flex"
        placeholder="Adjust number dynamically"
      />
    </Wrapper>
  );
};
