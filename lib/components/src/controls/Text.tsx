import React, { FC, ChangeEvent } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '../form';
import { ControlProps, TextValue, TextConfig } from './types';

export type TextProps = ControlProps<TextValue> & TextConfig;

const Wrapper = styled.label({
  display: 'flex',
});

export const TextControl: FC<TextProps> = ({ name, value, onChange, onFocus, onBlur }) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(name, event.target.value);
  };
  return (
    <Wrapper>
      <Form.Textarea
        id={name}
        onChange={handleChange}
        size="flex"
        placeholder="Adjust string dynamically"
        {...{ name, value, onFocus, onBlur }}
      />
    </Wrapper>
  );
};
