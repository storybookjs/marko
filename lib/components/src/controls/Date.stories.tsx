import React, { useState } from 'react';
import { DateControl } from './Date';

export default {
  title: 'Controls/Date',
  component: DateControl,
};

export const Basic = () => {
  const [value, setValue] = useState(new Date(2020, 4, 20));
  return (
    <>
      <DateControl name="date" value={value} onChange={(newVal) => setValue(newVal)} />
      <p>{value && new Date(value).toISOString()}</p>
    </>
  );
};

export const Undefined = () => {
  const [value, setValue] = useState(undefined);
  return (
    <>
      <DateControl name="date" value={value} onChange={(newVal) => setValue(newVal)} />
      <p>{value && new Date(value).toISOString()}</p>
    </>
  );
};
