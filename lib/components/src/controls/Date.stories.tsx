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
      <DateControl name="date" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <p>{value && new Date(value).toISOString()}</p>
    </>
  );
};
