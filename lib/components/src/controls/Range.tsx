import React, { FC, ChangeEvent } from 'react';

import { styled } from '@storybook/theming';
import { ControlProps, NumberValue, RangeConfig } from './types';
import { parse } from './Number';

type RangeProps = ControlProps<NumberValue | null> & RangeConfig;

const RangeInput = styled.input(
  {
    boxSizing: 'border-box',
    height: 25,
    outline: 'none',
    border: '1px solid #f7f4f4',
    borderRadius: 2,
    fontSize: 11,
    padding: 5,
    color: '#444',
  },
  {
    display: 'table-cell',
    flexGrow: 1,
  }
);

const RangeLabel = styled.span({
  paddingLeft: 5,
  paddingRight: 5,
  fontSize: 12,
  whiteSpace: 'nowrap',
});

const RangeWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const RangeControl: FC<RangeProps> = ({
  name,
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(name, parse(event.target.value));
  };
  return (
    <RangeWrapper>
      <RangeLabel>{min}</RangeLabel>
      <RangeInput
        value={value}
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
      <RangeLabel>{`${value} / ${max}`}</RangeLabel>
    </RangeWrapper>
  );
};
