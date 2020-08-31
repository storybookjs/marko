import { ArgTypes } from '@storybook/api';

import { ArgTypesExtractor, hasDocgen, extractComponentProps } from '../../lib/docgen';
import { convert } from '../../lib/convert';
import { trimQuotes } from '../../lib/convert/utils';

const SECTIONS = ['props', 'events', 'slots'];

const trim = (val: any) => (val && typeof val === 'string' ? trimQuotes(val) : val);

export const extractArgTypes: ArgTypesExtractor = (component) => {
  const results: ArgTypes = {
    rounded: {
      control: { type: 'boolean' },
      name: 'rounded',
      description: 'Round the button',
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
