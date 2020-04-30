import React, { useState } from 'react';
import { OptionsControl } from './Options';

export default {
  title: 'Controls/Options',
  component: OptionsControl,
};

const arrayOptions = ['Bat', 'Cat', 'Rat'];
const objectOptions = {
  A: { id: 'Aardvark' },
  B: { id: 'Bat' },
  C: { id: 'Cat' },
};
const emptyOptions = null;

const optionsHelper = (options, type) => {
  const [value, setValue] = useState([]);
  return (
    <>
      <OptionsControl
        name="options"
        options={options}
        value={value}
        type={type}
        onChange={(name, newVal) => setValue(newVal)}
      />
      {value && Array.isArray(value) ? (
        // eslint-disable-next-line react/no-array-index-key
        <ul>{value && value.map((item, idx) => <li key={idx}>{JSON.stringify(item)}</li>)}</ul>
      ) : (
        <p>{value ? JSON.stringify(value) : '-'}</p>
      )}
    </>
  );
};

// Check
export const CheckArray = () => optionsHelper(arrayOptions, 'check');
export const InlineCheckArray = () => optionsHelper(arrayOptions, 'inline-check');
export const CheckObject = () => optionsHelper(objectOptions, 'check');
export const InlineCheckObject = () => optionsHelper(objectOptions, 'inline-check');

// Radio
export const ArrayRadio = () => optionsHelper(arrayOptions, 'radio');
export const ArrayInlineRadio = () => optionsHelper(arrayOptions, 'inline-radio');
export const ObjectRadio = () => optionsHelper(objectOptions, 'radio');
export const ObjectInlineRadio = () => optionsHelper(objectOptions, 'inline-radio');

// Select
export const ArraySelect = () => optionsHelper(arrayOptions, 'select');
export const ArrayMultiSelect = () => optionsHelper(arrayOptions, 'multi-select');
export const ObjectSelect = () => optionsHelper(objectOptions, 'select');
export const ObjectMultiSelect = () => optionsHelper(objectOptions, 'multi-select');
