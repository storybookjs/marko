import { ArgTypes } from '@storybook/api';

import { ArgTypesExtractor, hasDocgen, extractComponentProps } from '../../lib/docgen';
import { convert } from '../../lib/convert';
import { trimQuotes } from '../../lib/convert/utils';

const SECTIONS = ['props', 'events', 'slots'];

const trim = (val: any) => (val && typeof val === 'string' ? trimQuotes(val) : val);

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
    version: 3;
  };
};

export const extractArgTypes: ArgTypesExtractor = (component) => {
  const item = new component({ props: {} });
  console.log(item.__docgen);
  const results: ArgTypes = {
    rounded: {
      control: { type: 'boolean' },
      name: 'rounded',
      description: 'round the button',
      defaultValue: false,

      table: {
        defaultValue: {
          summary: false,
        },
      },
    },
    text: {
      control: { type: 'text' },
      name: 'text',
      description: 'descriptive text',
      defaultValue: 'You Clicked',
      table: {
        defaultValue: {
          summary: 'your text here',
        },
      },
    },
  };

  return results;
};
