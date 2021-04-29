import React, { useState } from 'react';
import { ArrayControl } from './Array';

export default {
  title: 'Controls/Array',
  component: ArrayControl,
};

const Template = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <ArrayControl
        name="array"
        value={value}
        onChange={(newVal) => setValue(newVal)}
        separator=","
      />
      <ul>{value && value.map((item) => <li key={item}>{item}</li>)}</ul>
    </>
  );
};

export const Basic = () => Template(['Bat', 'Cat', 'Rat']);

export const Undefined = () => Template(undefined);
