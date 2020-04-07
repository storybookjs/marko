import { PropDef, PropsTableRowsProps } from '@storybook/components';
import { ArgTypes } from '@storybook/api';
import { ArgTypesExtractor } from '../../lib/docgen';
import { extractProps } from './extractProps';

// import camelCase from 'lodash/camelCase';
// Object.entries(subTypes).forEach(([key, val]) => {
//   const subLabel = camelCase(`${label} ${key}`);
//   acc[subLabel] = { ...val, table: { ...val.table, tab: label } };
// });

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const props = extractProps(component);
    const { rows } = props as PropsTableRowsProps;
    if (rows) {
      return rows.reduce((acc: ArgTypes, row: PropDef) => {
        const { type, sbType, defaultValue, jsDocTags } = row;
        acc[row.name] = {
          ...row,
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
