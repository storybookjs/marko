import { ArgTypes } from '@storybook/api';
import { ArgTypesExtractor, hasDocgen, extractComponentProps } from '../../lib/docgen';
import { convert } from '../../lib/convert';

const SECTIONS = ['props', 'events', 'slots'];

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!hasDocgen(component)) {
    return null;
  }
  const results: ArgTypes = {};
  SECTIONS.forEach((section) => {
    const props = extractComponentProps(component, section);
    props.forEach(({ propDef, docgenInfo, jsDocTags }) => {
      const { name, type, description, defaultValue: defaultSummary, required } = propDef;
      const sbType = section === 'props' ? convert(docgenInfo) : { name: 'void' };
      let defaultValue = defaultSummary && (defaultSummary.detail || defaultSummary.summary);
      try {
        // eslint-disable-next-line no-eval
        defaultValue = eval(defaultValue);
        // eslint-disable-next-line no-empty
      } catch {}

      results[name] = {
        name,
        description,
        type: { required, ...sbType },
        defaultValue,
        table: {
          type,
          jsDocTags,
          defaultValue: defaultSummary,
          category: section,
        },
      };
    });
  });
  return results;
};
