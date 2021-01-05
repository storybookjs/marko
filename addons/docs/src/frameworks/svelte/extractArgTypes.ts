import { ArgTypes } from '@storybook/api';
import { logger } from '@storybook/client-logger';

import { ArgTypesExtractor } from '../../lib/docgen';

type ComponentWithDocgen = {
  __docgen: Docgen;
};

type Docgen = {
  components: [];
  computed: [];
  data: [
    {
      defaultValue: any;
      description: string;
      keywords: [];
      kind: string;
      name: string;
      readonly: boolean;
      static: boolean;
      type: { kind: string; text: string; type: string };
      visibility: string;
    }
  ];
  description: null;
  events: [];
  keywords: [];
  methods: [];
  name: string;
  refs: [];
  slots: [];
  version: number;
};

export const extractArgTypes: ArgTypesExtractor = (component) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const docgen = component.__docgen;
    if (docgen) {
      return createArgTypes(docgen);
    }
  } catch (err) {
    logger.log(`Error extracting argTypes: ${err}`);
  }
  return {};
};

export const createArgTypes = (docgen: Docgen) => {
  const results: ArgTypes = {};
  docgen.data.forEach((item) => {
    results[item.name] = {
      control: { type: parseType(item.type.type) },
      name: item.name,
      description: item.description,
      type: {},
      defaultValue: item.defaultValue,
      table: {
        defaultValue: {
          summary: item.defaultValue,
        },
      },
    };
  });

  return results;
};

/**
 * Function to convert the type from sveltedoc-parser to a storybook type
 * @param typeName
 * @returns string
 */
const parseType = (typeName: string) => {
  switch (typeName) {
    case 'string':
      return 'text';

    case 'enum':
      return 'radio';
    case 'any':
      return 'object';
    default:
      return typeName;
  }
};
