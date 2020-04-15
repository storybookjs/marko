import React, { useState } from 'react';
import { TextControl } from './Text';

export default {
  title: 'Controls/Text',
  component: TextControl,
};

export const Basic = () => {
  const [value, setValue] = useState('Hello text');
  return (
    <>
      <TextControl name="Text" value={value} onChange={(name, newVal) => setValue(newVal)} />
      <p>{value}</p>
    </>
  );
};
