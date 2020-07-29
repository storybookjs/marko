import React, { FC, ChangeEvent } from 'react';
import { styled, CSSObject } from '@storybook/theming';
import { ControlProps, OptionsSelection, NormalizedOptionsConfig } from '../types';
import { selectedKey, selectedKeys, selectedValues } from './helpers';
import { Icons } from '../../icon/icon';

const styleResets: CSSObject = {
  // resets
  appearance: 'none',
  border: '0 none',
  boxSizing: 'inherit',
  display: ' block',
  margin: ' 0',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',
  position: 'relative',
};

const OptionsSelect = styled.select(({ theme }) => ({
  ...styleResets,

  position: 'relative',
  padding: '6px 10px',
  width: '100%',

  color: theme.input.color || 'inherit',
  background: theme.input.background,
  borderRadius: theme.input.borderRadius,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,

  fontSize: theme.typography.size.s2 - 1,
  lineHeight: '20px',

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 0 0 1px inset`,
    outline: 'none',
  },

  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '::placeholder': {
    color: theme.color.mediumdark,
  },

  '&[multiple]': {
    overflow: 'auto',
    padding: 0,

    option: {
      display: 'block',
      padding: '6px 10px',
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
    onChange(options[e.currentTarget.value]);
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
    onChange(selectedValues(selection, options));
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
