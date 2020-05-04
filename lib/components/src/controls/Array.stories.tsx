import React, { useState } from 'react';
import { ArrayControl } from './Array';

export default {
  title: 'Controls/Array',
  component: ArrayControl,
};

export const Basic = () => {
  const [value, setValue] = useState(['Bat', 'Cat', 'Rat']);
  return (
    <>
      <ArrayControl name="array" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <ul>{value && value.map((item) => <li key={item}>{item}</li>)}</ul>
    </>
  );
};

export const Null = () => {
  const [value, setValue] = useState(null);
  return (
    <>
      <ArrayControl name="array" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <ul>{value && value.map((item) => <li key={item}>{item}</li>)}</ul>
    </>
  );
};
