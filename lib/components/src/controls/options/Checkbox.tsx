import React, { FC, ChangeEvent, useState } from 'react';
import { styled } from '@storybook/theming';
import { ControlProps, OptionsMultiSelection, NormalizedOptionsConfig } from '../types';

const CheckboxesWrapper = styled.div<{ isInline: boolean }>(({ isInline }) =>
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

const CheckboxFieldset = styled.fieldset({
  border: 0,
  padding: 0,
  margin: 0,
});

const CheckboxLabel = styled.label({
  padding: '3px 0 3px 5px',
  lineHeight: '18px',
  display: 'inline-block',
});

type CheckboxConfig = NormalizedOptionsConfig & { isInline: boolean };
type CheckboxProps = ControlProps<OptionsMultiSelection> & CheckboxConfig;
export const CheckboxControl: FC<CheckboxProps> = ({
  name,
  options,
  value,
  onChange,
  isInline,
}) => {
  const [selected, setSelected] = useState(value || []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const option = (e.target as HTMLInputElement).value;
    const newVal = [...selected];
    if (newVal.includes(option)) {
      newVal.splice(newVal.indexOf(option), 1);
    } else {
      newVal.push(option);
    }
    onChange(name, newVal);
    setSelected(newVal);
  };

  return (
    <CheckboxFieldset>
      <CheckboxesWrapper isInline={isInline}>
        {Object.keys(options).map((key: string) => {
          const id = `${name}-${key}`;
          const optionValue = options[key];

          return (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                name={name}
                value={optionValue}
                onChange={handleChange}
                checked={selected.includes(optionValue)}
              />
              <CheckboxLabel htmlFor={id}>{key}</CheckboxLabel>
            </div>
          );
        })}
      </CheckboxesWrapper>
    </CheckboxFieldset>
  );
};
