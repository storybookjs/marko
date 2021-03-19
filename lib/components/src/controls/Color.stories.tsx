import React, { useState } from 'react';
import { ColorControl } from './Color';

export default {
  title: 'Controls/Color',
  component: ColorControl,
};

const Template = (initialValue?: string, presetColors?: string[]) => {
  const [value, setValue] = useState(initialValue);
  return (
    <ColorControl
      name="Color"
      value={value}
      onChange={(newVal) => setValue(newVal)}
      presetColors={presetColors}
      startOpen
    />
  );
};

export const Basic = () => Template('#ff0');

export const Undefined = () => Template(undefined);

export const WithPresetColors = () =>
  Template('#ff0', ['#fe4a49', '#fed766', '#009fb7', '#e6e6ea', '#f4f4f8']);
