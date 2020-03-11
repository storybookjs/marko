import { PropDefaultValue } from '@storybook/components';
import { DocgenPropDefaultValue, DocgenPropType } from '../types';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../utils';
import { isDefaultValueBlacklisted } from '../utils/defaultValue';

export function createDefaultValue(
  defaultValue: DocgenPropDefaultValue,
  type: DocgenPropType
): PropDefaultValue {
  if (defaultValue != null) {
    const { value } = defaultValue;

    if (!isDefaultValueBlacklisted(value)) {
      return !isTooLongForDefaultValueSummary(value)
        ? createSummaryValue(value)
        : createSummaryValue(type.name, value);
    }
  }

  return null;
}
