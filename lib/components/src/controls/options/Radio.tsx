import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { ControlProps, OptionsSingleSelection, NormalizedOptionsConfig } from '../types';
import { selectedKey } from './helpers';

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
  const selection = selectedKey(value, options);
  return (
    <RadiosWrapper isInline={isInline}>
      {Object.keys(options).map((key) => {
        const id = `${name}-${key}`;
        return (
          <div key={id}>
            <input
              type="radio"
              id={id}
              name={name}
              value={key}
              onChange={(e) => onChange(name, options[e.currentTarget.value])}
              checked={key === selection}
            />
            <RadioLabel htmlFor={id}>{key}</RadioLabel>
          </div>
        );
      })}
    </RadiosWrapper>
  );
};
