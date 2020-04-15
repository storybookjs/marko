import React, { useState } from 'react';
import { NumberControl } from './Number';

export default {
  title: 'Controls/Number',
  component: NumberControl,
};

export const Basic = () => {
  const [value, setValue] = useState(10);
  return (
    <>
      <NumberControl name="number" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <p>{value}</p>
    </>
  );
};
