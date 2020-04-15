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
  const { controlType, options } = props;
  const normalized = { ...props, options: normalizeOptions(options) };
  switch (controlType || 'select') {
    case 'check':
    case 'inline-check':
      return <CheckboxControl {...normalized} isInline={controlType === 'inline-check'} />;
    case 'radio':
    case 'inline-radio':
      return <RadioControl {...normalized} isInline={controlType === 'inline-radio'} />;
    case 'select':
    case 'multi-select':
      return <SelectControl {...normalized} isMulti={controlType === 'multi-select'} />;
    default:
      throw new Error(`Unknown options type: ${controlType}`);
  }
};
