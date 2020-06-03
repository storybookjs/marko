import React, { FC, ChangeEvent } from 'react';
import { styled } from '@storybook/theming';
import { ControlProps, OptionsSelection, NormalizedOptionsConfig } from '../types';
import { selectedKey, selectedKeys, selectedValues } from './helpers';

const OptionsSelect = styled.select({
  width: '100%',
  maxWidth: '300px',
  color: 'black',
});

type SelectConfig = NormalizedOptionsConfig & { isMulti: boolean };
type SelectProps = ControlProps<OptionsSelection> & SelectConfig;

const NO_SELECTION = 'Select...';

const SingleSelect: FC<SelectProps> = ({ name, value, options, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(name, options[e.currentTarget.value]);
  };
  const selection = selectedKey(value, options) || NO_SELECTION;

  return (
    <OptionsSelect value={selection} onChange={handleChange}>
      <option key="no-selection" disabled>
        {NO_SELECTION}
      </option>
      {Object.keys(options).map((key) => (
        <option key={key}>{key}</option>
      ))}
    </OptionsSelect>
  );
};

const MultiSelect: FC<SelectProps> = ({ name, value, options, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selection = Array.from(e.currentTarget.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    onChange(name, selectedValues(selection, options));
  };
  const selection = selectedKeys(value, options);

  return (
    <OptionsSelect multiple value={selection} onChange={handleChange}>
      {Object.keys(options).map((key) => (
        <option key={key}>{key}</option>
      ))}
    </OptionsSelect>
  );
};

export const SelectControl: FC<SelectProps> = (props) =>
  // eslint-disable-next-line react/destructuring-assignment
  props.isMulti ? <MultiSelect {...props} /> : <SingleSelect {...props} />;
