import React, { useState } from 'react';
import { ObjectControl } from './Object';

export default {
  title: 'Controls/Object',
  component: ObjectControl,
};

export const Basic = () => {
  const [value, setValue] = useState({ name: 'Michael', nested: { something: true } });
  return (
    <>
      <ObjectControl name="object" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <p>{value && JSON.stringify(value)}</p>
    </>
  );
};

export const Null = () => {
  const [value, setValue] = useState(null);
  return (
    <>
      <ObjectControl name="object" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <p>{value && JSON.stringify(value)}</p>
    </>
  );
};
