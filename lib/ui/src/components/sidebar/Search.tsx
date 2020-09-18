import React, { ComponentProps, useState, ChangeEvent, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { opacify } from 'polished';
import { Icons } from '@storybook/components';

export type FilterFieldProps = ComponentProps<'input'>;

export type FocusKeyProps = ComponentProps<'code'>;
export type CancelButtonProps = ComponentProps<'button'>;
export type SearchProps = Omit<FilterFieldProps, 'onChange'> & {
  onChange: (arg: string) => void;
  defaultFocussed?: boolean;
};
export type FilterFormProps = ComponentProps<'form'> & {
  focussed: boolean;
};

const FilterField = styled.input<FilterFieldProps>(({ theme }) => ({
  // resets
  appearance: 'none',
  border: 'none',
  boxSizing: 'inherit',
  display: 'block',
  outline: 'none',
  width: '100%',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',

  '&::-ms-clear': {
    display: 'none',
  },
  '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration': {
    display: 'none',
  },
  '&:-webkit-autofill': {
    WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset`,
  },
  '::placeholder': {
    color: theme.color.dark,
  },
  '&:placeholder-shown ~ button': {
    // hide cancel button using CSS only
    opacity: 0,
    pointerEvents: 'none',
  },
}));

const FocusKey = styled.code<FocusKeyProps>(({ theme }) => ({
  position: 'absolute',
  top: 5,
  right: 12,
  width: 16,
  height: 16,
  zIndex: 1,
  lineHeight: '17px',
  textAlign: 'center',
  fontSize: '11px',
  background: 'rgba(0,0,0,0.1)',
  color: theme.color.mediumdark,
  borderRadius: 2,
  userSelect: 'none',
  pointerEvents: 'none',
}));

const CancelButton = styled.button<CancelButtonProps>(({ theme }) => ({
  border: 0,
  outline: 0,
  margin: 0,
  padding: 4,
  textDecoration: 'none',

  background: theme.appBorderColor,
  borderRadius: '1em',
  cursor: 'pointer',
  opacity: 1,
  transition: 'all 150ms ease-out',

  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: 12,

  '> svg': {
    display: 'block',
    height: 8,
    width: 8,
    color: theme.input.color,
    transition: 'all 150ms ease-out',
  },

  '&:hover': {
    background: opacify(0.1, theme.appBorderColor),
  },
}));

const FilterForm = styled.form<FilterFormProps>(({ theme, focussed }) => ({
  transition: 'all 150ms ease-out',
  border: `1px solid transparent`,
  borderRadius: 28,
  borderColor: focussed ? theme.color.secondary : theme.color.medium,
  backgroundColor: focussed ? theme.color.lightest : 'transparent',
  outline: 0,
  position: 'relative',
  marginLeft: -10,
  marginRight: -10,

  input: {
    color: theme.color.darkest,
    fontSize: theme.typography.size.s1,
    lineHeight: '16px',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 28,
    paddingRight: 28,

    '&:valid ~ code': {
      display: 'none',
    },
  },

  '> svg': {
    transition: 'all 150ms ease-out',
    position: 'absolute',
    top: '50%',
    left: 10,
    height: 12,
    width: 12,
    transform: 'translateY(-50%)',
    zIndex: 1,

    color: focussed ? theme.color.darker : theme.color.mediumdark,
    background: 'transparent',

    path: {
      transition: 'all 150ms ease-out',
      fill: 'currentColor',
    },
  },

  '> code': {
    display: focussed ? 'none' : 'block',
  },
}));

export const Search: FunctionComponent<SearchProps> = ({
  className,
  onChange,
  defaultFocussed = false,
  defaultValue,
  ...props
}) => {
  const [focussed, onSetFocussed] = useState(defaultFocussed);
  return (
    <FilterForm
      autoComplete="off"
      focussed={focussed}
      className={className}
      onReset={() => onChange('')}
      onSubmit={(e) => e.preventDefault()}
    >
      <FilterField
        required
        type="search"
        id="storybook-explorer-searchfield"
        onFocus={() => onSetFocussed(true)}
        onBlur={() => onSetFocussed(false)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
        defaultValue={defaultValue}
        {...props}
        placeholder={focussed ? 'Search components & stories' : 'Press / to search'}
        aria-label="Search components and stories"
      />
      <Icons icon="search" />
      <FocusKey>/</FocusKey>
      <CancelButton type="reset" value="reset" title="Clear search">
        <Icons icon="closeAlt" />
      </CancelButton>
    </FilterForm>
  );
};
