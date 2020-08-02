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

const optionsHelper = (options, type, isMulti) => {
  const initial = Array.isArray(options) ? options[1] : options.B;
  const [value, setValue] = useState(isMulti ? [initial] : initial);
  return (
    <>
      <OptionsControl
        name="options"
        options={options}
        value={value}
        type={type}
        onChange={(newVal) => setValue(newVal)}
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
export const CheckArray = () => optionsHelper(arrayOptions, 'check', true);
export const InlineCheckArray = () => optionsHelper(arrayOptions, 'inline-check', true);
export const CheckObject = () => optionsHelper(objectOptions, 'check', true);
export const InlineCheckObject = () => optionsHelper(objectOptions, 'inline-check', true);

// Radio
export const ArrayRadio = () => optionsHelper(arrayOptions, 'radio', false);
export const ArrayInlineRadio = () => optionsHelper(arrayOptions, 'inline-radio', false);
export const ObjectRadio = () => optionsHelper(objectOptions, 'radio', false);
export const ObjectInlineRadio = () => optionsHelper(objectOptions, 'inline-radio', false);

// Select
export const ArraySelect = () => optionsHelper(arrayOptions, 'select', false);
export const ArrayMultiSelect = () => optionsHelper(arrayOptions, 'multi-select', true);
export const ObjectSelect = () => optionsHelper(objectOptions, 'select', false);
export const ObjectMultiSelect = () => optionsHelper(objectOptions, 'multi-select', true);
