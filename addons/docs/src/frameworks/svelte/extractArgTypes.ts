/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
import { ArgTypes } from '@storybook/api';

import { ArgTypesExtractor, hasDocgen, extractComponentProps } from '../../lib/docgen';

type ComponentWithDocgen = {
  __docgen: {
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
    name: null;
    refs: [];
    slots: [];
    version: number;
  };
};

export const extractArgTypes: ArgTypesExtractor = (component) => {
  const comp: ComponentWithDocgen = new component({ props: {} });
  const docs = comp.__docgen;
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
 *  @returns string
 */
const parseType = (typeName: string) => {
  if (typeName === 'string') return 'text';
  return typeName;
};
