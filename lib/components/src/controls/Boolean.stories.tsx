import React, { useState } from 'react';
import { BooleanControl } from './Boolean';

export default {
  title: 'Controls/Boolean',
  component: BooleanControl,
};

const Template = (initialValue?: boolean) => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <BooleanControl name="boolean" value={value} onChange={(newVal) => setValue(newVal)} />
      <p>value: {typeof value === 'boolean' ? value.toString() : value}</p>
    </>
  );
};

export const Basic = () => Template(false);

export const Undefined = () => Template(undefined);
