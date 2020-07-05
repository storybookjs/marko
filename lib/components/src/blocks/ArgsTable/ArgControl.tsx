import React, { FC, useCallback } from 'react';
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

export const ArgControl: FC<ArgControlProps> = ({ row, arg, updateArgs }) => {
  const { name, control } = row;
  const onChange = useCallback(
    (argName: string, argVal: any) => {
      updateArgs({ [name]: argVal });
      return argVal;
    },
    [updateArgs, name]
  );

  if (!control || control.disable) return <NoControl />;

  const props = { name, argType: row, value: arg, onChange };
  switch (control.type) {
    case 'array':
      return <ArrayControl {...props} {...control} />;
    case 'boolean':
      return <BooleanControl {...props} {...control} />;
    case 'color':
      return <ColorControl {...props} {...control} />;
    case 'date':
      return <DateControl {...props} {...control} />;
    case 'number':
      return <NumberControl {...props} {...control} />;
    case 'object':
      return <ObjectControl {...props} {...control} />;
    case 'check':
    case 'inline-check':
    case 'radio':
    case 'inline-radio':
    case 'select':
    case 'multi-select':
      return <OptionsControl {...props} {...control} controlType={control.type} />;
    case 'range':
      return <RangeControl {...props} {...control} />;
    case 'text':
      return <TextControl {...props} {...control} />;
    default:
      return <NoControl />;
  }
};
