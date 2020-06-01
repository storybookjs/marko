import React, { FC } from 'react';

import { CheckboxControl } from './Checkbox';
import { RadioControl } from './Radio';
import { SelectControl } from './Select';
import { ControlProps, OptionsSelection, OptionsConfig, Options } from '../types';

const normalizeOptions = (options: Options) => {
  if (Array.isArray(options)) {
    return options.reduce((acc, item) => {
      acc[item] = item;
      return acc;
    }, {});
  }
  return options;
};

export type OptionsProps = ControlProps<OptionsSelection> & OptionsConfig;
export const OptionsControl: FC<OptionsProps> = (props) => {
  const { type = 'select', options } = props;
  const normalized = { ...props, options: normalizeOptions(options) };
  switch (type) {
    case 'check':
    case 'inline-check':
      return <CheckboxControl {...normalized} isInline={type === 'inline-check'} />;
    case 'radio':
    case 'inline-radio':
      return <RadioControl {...normalized} isInline={type === 'inline-radio'} />;
    case 'select':
    case 'multi-select':
      return <SelectControl {...normalized} isMulti={type === 'multi-select'} />;
    default:
      throw new Error(`Unknown options type: ${type}`);
  }
};
