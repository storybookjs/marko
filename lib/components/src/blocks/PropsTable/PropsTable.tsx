import React from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { PropRow } from './PropRow';
import { PropDef } from './PropDef';
import { EmptyBlock } from '../EmptyBlock';

export const Table = styled.table(({ theme }) => ({
  '&&': {
    // To prevent cascading styles from wrapper
    // Resets
    borderCollapse: 'collapse',
    borderSpacing: 0,

    tr: {
      border: 'none',
      background: 'none',
    },

    'td, th': {
      padding: 0,
      border: 'none',
    },
    // End Resets

    fontSize: theme.typography.size.s2,
    lineHeight: '20px',

    margin: '1.5rem 0 2.5rem',
    textAlign: 'left',
    width: '100%',
    // tableLayout: 'fixed',

    'th:first-of-type, td:first-of-type': {
      paddingLeft: 20,
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: '20px',
      width: '20%',
    },

    // Table "block" styling
    // Emphasize tbody's background and set borderRadius
    // Calling out because styling tables is finicky
    'tr:first-child td:first-child': {
      borderTopLeftRadius: theme.appBorderRadius,
    },

    'tr:first-child td:last-child': {
      borderTopRightRadius: theme.appBorderRadius,
    },
    'tr:last-child td:first-child': {
      borderBottomLeftRadius: theme.appBorderRadius,
    },

    'tr:last-child td:last-child': {
      borderBottomRightRadius: theme.appBorderRadius,
    },

    tbody: {
      boxShadow: `rgba(0, 0, 0, 0.10) 0 2px 5px 0`,
      borderRadius: theme.appBorderRadius,

      tr: {
        background: 'transparent',
        '&:not(:first-child)': {
          borderTop: `1px solid ${theme.appBorderColor}`,
        },
      },

      td: {
        background: theme.background.content,
      },
    },

    // End table block styling

    th: {
      color:
        theme.base === 'light'
          ? transparentize(0.4, theme.color.defaultText)
          : transparentize(0.6, theme.color.defaultText),
      paddingTop: 10,
      paddingBottom: 10,

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },
    },

    td: {
      paddingTop: '16px',
      paddingBottom: '16px',

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },

      '&:last-of-type': {
        paddingRight: '20px',
      },
    },
  },
}));

export enum PropsTableError {
  NO_COMPONENT = 'No component found',
  PROPS_UNSUPPORTED = 'The props unsupported. Check to see if your framework is supported.',
}

export interface PropsTableProps {
  rows?: PropDef[];
  error?: PropsTableError;
  // FIXME: table options
}

const PropsTable: React.FunctionComponent<PropsTableProps> = ({ rows, error = null }) => {
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }
  if (rows.length === 0) {
    return <EmptyBlock>No props found for this component</EmptyBlock>;
  }
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <PropRow key={row.name} row={row} />
        ))}
      </tbody>
    </Table>
  );
};

export { PropsTable, PropDef };
