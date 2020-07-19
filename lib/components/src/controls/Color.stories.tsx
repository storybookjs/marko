import React, { useState } from 'react';
import { ColorControl } from './Color';

const presetColors = ['#FE4A49', '#FED766', '#009FB7', '#E6E6EA', '#F4F4F8'];

export default {
  title: 'Controls/Color',
  component: ColorControl,
};

export const Basic = () => {
  const [value, setValue] = useState('#ff0');
  return <ColorControl name="Color" value={value} onChange={(name, newVal) => setValue(newVal)} />;
};

export const withPresetColors = () => {
  const [value, setValue] = useState('#ff0');
  return (
    <ColorControl
      name="Color"
      value={value}
      onChange={(name, newVal) => setValue(newVal)}
      presetColors={presetColors}
    />
  );
};
