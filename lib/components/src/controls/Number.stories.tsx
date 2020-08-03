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
      <NumberControl name="number" value={value} onChange={(newVal) => setValue(newVal)} />
      <p>{value}</p>
    </>
  );
};

export const Undefined = () => {
  const [value, setValue] = useState(undefined);
  return (
    <>
      <NumberControl name="number" value={value} onChange={(newVal) => setValue(newVal)} />
      <p>{value}</p>
    </>
  );
};
