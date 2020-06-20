import React, { FC, ChangeEvent } from 'react';
import { styled } from '@storybook/theming';
import { ControlProps, OptionsSelection, NormalizedOptionsConfig } from '../types';
import { selectedKey, selectedKeys, selectedValues } from './helpers';
import { Icons } from '../../icon/icon';

const OptionsSelect = styled.select(({ theme }) => ({
  // Resets
  appearance: 'none',
  border: '0',
  lineHeight: '20px',
  padding: '6px 10px 6px 10px',
  position: 'relative',
  outline: 'none',
  width: '100%',
  overflow: 'auto',
  // end resets

  borderRadius: theme.input.borderRadius,
  fontSize: theme.typography.size.s2 - 1,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 0 0 1px inset`,
  },

  '&[multiple]': {
    padding: 0,

    option: {
      display: 'block',
      padding: '6px 10px 6px 10px',
      marginLeft: 1,
      marginRight: 1,
    },
  },
}));

const SelectWrapper = styled.span`
  display: inline-block;
  line-height: normal;
  overflow: hidden;
  position: relative;
  vertical-align: top;
  width: 100%;

  svg {
    position: absolute;
    z-index: 1;
    pointer-events: none;
    height: 12px;
    margin-top: -6px;
    right: 12px;
    top: 50%;

    path {
      fill: currentColor;
    }
  }
`;

type SelectConfig = NormalizedOptionsConfig & { isMulti: boolean };
type SelectProps = ControlProps<OptionsSelection> & SelectConfig;

const NO_SELECTION = 'Select...';

const SingleSelect: FC<SelectProps> = ({ name, value, options, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(name, options[e.currentTarget.value]);
  };
  const selection = selectedKey(value, options) || NO_SELECTION;

  return (
    <SelectWrapper>
      <Icons icon="arrowdown" />
      <OptionsSelect value={selection} onChange={handleChange}>
        <option key="no-selection" disabled>
          {NO_SELECTION}
        </option>
        {Object.keys(options).map((key) => (
          <option key={key}>{key}</option>
        ))}
      </OptionsSelect>
    </SelectWrapper>
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
    <SelectWrapper>
      <OptionsSelect multiple value={selection} onChange={handleChange}>
        {Object.keys(options).map((key) => (
          <option key={key}>{key}</option>
        ))}
      </OptionsSelect>
    </SelectWrapper>
  );
};

export const SelectControl: FC<SelectProps> = (props) =>
  // eslint-disable-next-line react/destructuring-assignment
  props.isMulti ? <MultiSelect {...props} /> : <SingleSelect {...props} />;
