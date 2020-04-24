import React, { FC, Validator } from 'react';
import { styled } from '@storybook/theming';
import { ControlProps, OptionsSingleSelection, NormalizedOptionsConfig } from '../types';

const RadiosWrapper = styled.div<{ isInline: boolean }>(({ isInline }) =>
  isInline
    ? {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '> * + *': {
          marginLeft: 10,
        },
      }
    : {}
);

const RadioLabel = styled.label({
  padding: '3px 0 3px 5px',
  lineHeight: '18px',
  display: 'inline-block',
});

type RadioConfig = NormalizedOptionsConfig & { isInline: boolean };
type RadioProps = ControlProps<OptionsSingleSelection> & RadioConfig;
export const RadioControl: FC<RadioProps> = ({ name, options, value, onChange, isInline }) => {
  return (
    <RadiosWrapper isInline={isInline}>
      {Object.keys(options).map((key) => {
        const id = `${name}-${key}`;
        const optionValue = options[key];
        return (
          <div key={id}>
            <input
              type="radio"
              id={id}
              name={name}
              value={optionValue || undefined}
              onChange={(e) => onChange(name, e.target.value)}
              checked={optionValue === value}
            />
            <RadioLabel htmlFor={id}>{key}</RadioLabel>
          </div>
        );
      })}
    </RadiosWrapper>
  );
};
