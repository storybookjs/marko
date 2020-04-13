import React, { FC } from 'react';
import ReactSelect from 'react-select';
import { styled } from '@storybook/theming';
import { ControlProps, OptionsSelection, NormalizedOptionsConfig } from '../types';

// TODO: Apply the Storybook theme to react-select
const OptionsSelect = styled(ReactSelect)({
  width: '100%',
  maxWidth: '300px',
  color: 'black',
});

interface OptionsItem {
  value: any;
  label: string;
}
type ReactSelectOnChangeFn = { (v: OptionsItem): void } | { (v: OptionsItem[]): void };

type SelectConfig = NormalizedOptionsConfig & { isMulti: boolean };
type SelectProps = ControlProps<OptionsSelection> & SelectConfig;
export const SelectControl: FC<SelectProps> = ({ name, value, options, onChange, isMulti }) => {
  // const optionsIndex = options.findIndex(i => i.value === value);
  // let defaultValue: typeof options | typeof options[0] = options[optionsIndex];
  const selectOptions = Object.entries(options).reduce((acc, [key, val]) => {
    acc.push({ label: key, value: val });
    return acc;
  }, []);

  const handleChange: ReactSelectOnChangeFn = isMulti
    ? (values: OptionsItem[]) => onChange(name, values && values.map((item) => item.value))
    : (e: OptionsItem) => onChange(name, e.value);

  return (
    <OptionsSelect
      defaultValue={value}
      options={selectOptions}
      isMulti={isMulti}
      onChange={handleChange}
    />
  );
};
