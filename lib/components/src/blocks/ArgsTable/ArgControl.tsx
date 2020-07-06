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
  const [value, setValue] = useState(arg);

  const lastProps = useRef(props);
  useEffect(() => {
    lastProps.current = props;
    if (!isFocused) {
      setValue(props.arg);
    }
  });

  const onChange = useCallback(
    (argName: string, argVal: any) => {
      setValue(argVal);
      updateArgs({ [name]: argVal });
      return argVal;
    },
    [updateArgs, name]
  );

  const onBlur = useCallback(() => {
    setFocused(false);
    const lastValue = lastProps.current.arg;
    if (lastValue !== value) {
      setValue(lastValue);
    }
  }, [name]);

  const onFocus = useCallback(() => {
    setFocused(true);
  }, [name]);

  if (!control || control.disable) return <NoControl />;

  const rest = { name, argType: row, value, onChange, onBlur, onFocus };
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
