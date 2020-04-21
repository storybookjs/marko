import { PropDef, PropsTableRowsProps } from '@storybook/components';
import { ArgTypes } from '@storybook/api';
import { ArgTypesExtractor } from '../../lib/docgen';
import { trimQuotes } from '../../lib/sbtypes/utils';
import { extractProps } from './extractProps';

const trim = (val: any) => (val && typeof val === 'string' ? trimQuotes(val) : val);

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const props = extractProps(component);
    const { rows } = props as PropsTableRowsProps;
    if (rows) {
      return rows.reduce((acc: ArgTypes, row: PropDef) => {
        const { type, sbType, defaultValue, jsDocTags, required } = row;
        acc[row.name] = {
          ...row,
          defaultValue: defaultValue && trim(defaultValue.detail || defaultValue.summary),
          type: { required, ...sbType },
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
