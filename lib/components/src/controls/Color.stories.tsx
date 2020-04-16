import React, { useState } from 'react';
import { ColorControl } from './Color';

export default {
  title: 'Controls/Color',
  component: ColorControl,
};

export const Basic = () => {
  const [value, setValue] = useState('#ff0');
  return <ColorControl name="Color" value={value} onChange={(name, newVal) => setValue(newVal)} />;
};
