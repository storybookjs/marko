import React, { FC } from 'react';

import { CheckboxControl } from './Checkbox';
import { RadioControl } from './Radio';
import { SelectControl } from './Select';
import { ControlProps, OptionsSelection, OptionsConfig, Options } from '../types';

/**
 * Options can accept `options` in two formats:
 * - array: ['a', 'b', 'c'] OR
 * - object: { a: 1, b: 2, c: 3 }
 *
 * We always normalize to the more generalized object format and ONLY handle
 * the object format in the underlying control implementations.
 */
const normalizeOptions = (options: Options) => {
  if (Array.isArray(options)) {
    return options.reduce((acc, item) => {
      acc[String(item)] = item;
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
