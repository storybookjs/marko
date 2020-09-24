import { ArgTypes } from '@storybook/api';

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
  // eslint-disable-next-line new-cap
  const comp: ComponentWithDocgen = new component({ props: {} });
  // eslint-disable-next-line no-underscore-dangle
  const docs = comp.__docgen;

  const results = createArgTypes(docs);

  return results;
};

export const createArgTypes = (docs: Docgen) => {
  const results: ArgTypes = {};
  docs.data.forEach((item) => {
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
