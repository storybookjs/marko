import { PropDef, PropsTableRowsProps } from '@storybook/components';
import { ArgTypes } from '@storybook/api';
import { ArgTypesExtractor } from '../../lib/docgen';
import { extractProps } from './extractProps';

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const props = extractProps(component);
    const { rows } = props as PropsTableRowsProps;
    if (rows) {
      return rows.reduce((acc: ArgTypes, row: PropDef) => {
        const { type, sbType, defaultValue, jsDocTags } = row;
        acc[row.name] = {
          ...row,
          defaultValue: defaultValue && (defaultValue.detail || defaultValue.summary),
          type: sbType,
          table: {
            type,
            jsDocTags,
            defaultValue,
          },
        };
        return acc;
      }, {});
    }
  }

  return null;
};
