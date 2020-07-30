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
    />
  );
};

export const Basic = () => Template('#ff0');

export const Undefined = () => Template(undefined);

export const WithPresetColors = () =>
  Template('#ff0', ['#FE4A49', '#FED766', '#009FB7', '#E6E6EA', '#F4F4F8']);
