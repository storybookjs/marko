import React, { useState } from 'react';
import { initial } from 'lodash';
import { RangeControl } from './Range';

export default {
  title: 'Controls/Range',
  component: RangeControl,
};

export const Template = (initialValue?: number) => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <RangeControl
        name="range"
        value={value}
        onChange={(name, newVal) => setValue(newVal)}
        min={0}
        max={20}
        step={2}
      />
      <p>{value}</p>
    </>
  );
};

export const Basic = () => Template(10);

export const Undefined = () => Template(undefined);
