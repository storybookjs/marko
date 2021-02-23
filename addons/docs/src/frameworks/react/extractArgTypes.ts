import { ArgTypes } from '@storybook/api';
import { PropDef, ArgTypesExtractor } from '../../lib/docgen';
import { extractProps } from './extractProps';

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const { rows } = extractProps(component);
    if (rows) {
      return rows.reduce((acc: ArgTypes, row: PropDef) => {
        const { name, type, sbType, defaultValue: defaultSummary, jsDocTags, required } = row;

        let defaultValue;
        if (component.defaultProps) {
          defaultValue = component.defaultProps[name];
        } else {
          const defaultValueString =
            defaultSummary && (defaultSummary.detail || defaultSummary.summary);
          try {
            if (defaultValueString) {
              // eslint-disable-next-line no-new-func
              defaultValue = Function(`"use strict";return (${defaultValueString})`)();
            }
            // eslint-disable-next-line no-empty
          } catch {}
        }

        acc[row.name] = {
          ...row,
          defaultValue,
          type: { required, ...sbType },
          table: {
            type,
            jsDocTags,
            defaultValue: defaultSummary,
          },
        };
        return acc;
      }, {});
    }
  }

  return null;
};
