import React, { useState } from 'react';
import { BooleanControl } from './Boolean';

export default {
  title: 'Controls/Boolean',
  component: BooleanControl,
};

export const Basic = () => {
  const [value, setValue] = useState(false);
  return (
    <>
      <BooleanControl name="boolean" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <p>value: {value.toString()}</p>
    </>
  );
};
