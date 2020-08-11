import React, { useState } from 'react';
import { RangeControl } from './Range';

export default {
  title: 'Controls/Range',
  component: RangeControl,
};

const Template = (initialValue?: number) => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <RangeControl
        name="range"
        value={value}
        onChange={(newVal) => setValue(newVal)}
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
