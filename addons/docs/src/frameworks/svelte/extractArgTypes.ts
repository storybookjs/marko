import { ArgTypes } from '@storybook/api';
import { logger } from '@storybook/client-logger';
import type {
  SvelteComponentDoc,
  JSDocType,
  JSDocKeyword,
  JSDocTypeConst,
} from 'sveltedoc-parser/typings';

import { ArgTypesExtractor } from '../../lib/docgen';

type ComponentWithDocgen = {
  __docgen: SvelteComponentDoc;
};

function hasKeyword(keyword: string, keywords: JSDocKeyword[]): boolean {
  return keywords ? keywords.find((k) => k.name === keyword) != null : false;
}

export const extractArgTypes: ArgTypesExtractor = (component: ComponentWithDocgen) => {
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

export const createArgTypes = (docgen: SvelteComponentDoc) => {
  const results: ArgTypes = {};
  docgen.data.forEach((item) => {
    results[item.name] = {
      control: parseTypeToControl(item.type),
      name: item.name,
      description: item.description,
      type: {
        required: hasKeyword('required', item.keywords),
        summary: item.type?.text,
      },
      defaultValue: item.defaultValue,
      table: {
        type: {
          summary: item.type?.text,
        },
        defaultValue: {
          summary: item.defaultValue,
        },
        category: 'properties',
      },
    };
  });

  docgen.events.forEach((item) => {
    results[`event_${item.name}`] = {
      name: item.name,
      description: item.description,
      type: { name: 'void' },
      table: {
        category: 'events',
      },
    };
  });

  docgen.slots.forEach((item) => {
    results[`slot_${item.name}`] = {
      name: item.name,
      description: [item.description, item.params?.map((p) => `\`${p.name}\``).join(' ')]
        .filter((p) => p)
        .join('\n\n'),
      type: { name: 'void' },
      table: {
        category: 'slots',
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
const parseTypeToControl = (type: JSDocType): any => {
  if (!type) {
    return null;
  }

  if (type.kind === 'type') {
    switch (type.type) {
      case 'string':
        return { type: 'text' };

      case 'enum':
        return { type: 'radio' };
      case 'any':
        return { type: 'object' };
      default:
        return { type: type.type };
    }
  } else if (type.kind === 'union') {
    if (Array.isArray(type.type) && !type.type.find((t) => t.type !== 'string')) {
      return {
        type: 'radio',
        options: type.type.filter((t) => t.kind === 'const').map((t: JSDocTypeConst) => t.value),
      };
    }
  }

  return null;
};
