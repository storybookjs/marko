import React, { FC, useCallback, useState, useRef, useEffect } from 'react';
import { Args, ArgType } from './types';
import {
  ArrayControl,
  BooleanControl,
  ColorControl,
  DateControl,
  NumberControl,
  ObjectControl,
  OptionsControl,
  RangeControl,
  TextControl,
} from '../../controls';

export interface ArgControlProps {
  row: ArgType;
  arg: any;
  updateArgs: (args: Args) => void;
}

const NoControl = () => <>-</>;

export const ArgControl: FC<ArgControlProps> = (props) => {
  const { row, arg, updateArgs } = props;
  const { name, control } = row;

  const [isFocused, setFocused] = useState(false);
  // box because arg can be a fn (e.g. actions) and useState calls fn's
  const [boxedValue, setBoxedValue] = useState({ value: arg });

  useEffect(() => {
    if (!isFocused) setBoxedValue({ value: arg });
  }, [isFocused, arg]);

  const onChange = useCallback(
    (argName: string, argVal: any) => {
      setBoxedValue({ value: argVal });
      updateArgs({ [name]: argVal });
      return argVal;
    },
    [updateArgs, name]
  );

  const onBlur = useCallback(() => setFocused(false), []);
  const onFocus = useCallback(() => setFocused(true), []);

  if (!control || control.disable) return <NoControl />;

  const rest = { name, argType: row, value: boxedValue.value, onChange, onBlur, onFocus };
  switch (control.type) {
    case 'array':
      return <ArrayControl {...rest} {...control} />;
    case 'boolean':
      return <BooleanControl {...rest} {...control} />;
    case 'color':
      return <ColorControl {...rest} {...control} />;
    case 'date':
      return <DateControl {...rest} {...control} />;
    case 'number':
      return <NumberControl {...rest} {...control} />;
    case 'object':
      return <ObjectControl {...rest} {...control} />;
    case 'check':
    case 'inline-check':
    case 'radio':
    case 'inline-radio':
    case 'select':
    case 'multi-select':
      return <OptionsControl {...rest} {...control} controlType={control.type} />;
    case 'range':
      return <RangeControl {...rest} {...control} />;
    case 'text':
      return <TextControl {...rest} {...control} />;
    default:
      return <NoControl />;
  }
};
