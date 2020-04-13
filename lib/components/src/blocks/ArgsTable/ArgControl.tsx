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

export const ArgControl: FC<ArgControlProps> = ({ row, arg, updateArgs }) => {
  const { name, control } = row;
  const onChange = useCallback(
    (argName: string, argVal: any) => {
      updateArgs({ [name]: argVal });
      return argVal;
    },
    [updateArgs, name]
  );

  if (!control) {
    return <>-</>;
  }

  const props = { name, value: arg, onChange };
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
    case 'options':
      return <OptionsControl {...props} {...control} />;
    case 'range':
      return <RangeControl {...props} {...control} />;
    case 'text':
      return <TextControl {...props} {...control} />;
    default:
      return null;
  }
};
