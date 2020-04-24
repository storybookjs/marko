import React, { useState } from 'react';
import { RangeControl } from './Range';

export default {
  title: 'Controls/Range',
  component: RangeControl,
};

export const Basic = () => {
  const [value, setValue] = useState(10);
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
