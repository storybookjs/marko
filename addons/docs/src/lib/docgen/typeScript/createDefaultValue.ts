import { PropDefaultValue } from '@storybook/components';
import { DocgenInfo } from '../types';
import { createSummaryValue } from '../../utils';
import { isDefaultValueBlacklisted } from '../utils/defaultValue';

export function createDefaultValue({ defaultValue }: DocgenInfo): PropDefaultValue {
  if (defaultValue != null) {
    const { value } = defaultValue;

    if (!isDefaultValueBlacklisted(value)) {
      return createSummaryValue(value);
    }
  }

  return null;
}
