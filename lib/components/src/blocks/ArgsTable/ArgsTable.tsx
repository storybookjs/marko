import React, { FC } from 'react';
import { styled, ignoreSsrWarning } from '@storybook/theming';
import { opacify, transparentize, darken, lighten } from 'polished';
import { ArgRow, ArgRowProps } from './ArgRow';
import { SectionRow, SectionRowProps } from './SectionRow';
import { ArgType, ArgTypes, Args } from './types';
import { EmptyBlock } from '../EmptyBlock';
import { ResetWrapper } from '../../typography/DocumentFormatting';

export const TableWrapper = styled.table<{ compact?: boolean }>(({ theme, compact }) => ({
  '&&': {
    // Resets for cascading/system styles
    borderCollapse: 'collapse',
    borderSpacing: 0,
    color: theme.color.defaultText,
    tr: {
      border: 'none',
      background: 'none',
    },

    'td, th': {
      padding: 0,
      border: 'none',
      verticalAlign: 'top',
    },
    // End Resets

    fontSize: theme.typography.size.s2,
    lineHeight: '20px',
    textAlign: 'left',
    width: '100%',

    // Margin collapse
    marginTop: 25,
    marginBottom: 40,

    'th:first-of-type, td:first-of-type': {
      paddingLeft: 20,
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: 20,
      ...(compact ? null : { width: '20%' }),
    },

    th: {
      color:
        theme.base === 'light'
          ? transparentize(0.25, theme.color.defaultText)
          : transparentize(0.45, theme.color.defaultText),
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
        paddingRight: 20,
      },
    },

    // Table "block" styling
    // Emphasize tbody's background and set borderRadius
    // Calling out because styling tables is finicky

    // Makes border alignment consistent w/other DocBlocks
    marginLeft: 1,
    marginRight: 1,

    [`tr:first-child${ignoreSsrWarning}`]: {
      [`td:first-child${ignoreSsrWarning}, th:first-child${ignoreSsrWarning}`]: {
        borderTopLeftRadius: theme.appBorderRadius,
      },
      [`td:last-child${ignoreSsrWarning}, th:last-child${ignoreSsrWarning}`]: {
        borderTopRightRadius: theme.appBorderRadius,
      },
    },

    [`tr:last-child${ignoreSsrWarning}`]: {
      [`td:first-child${ignoreSsrWarning}, th:first-child${ignoreSsrWarning}`]: {
        borderBottomLeftRadius: theme.appBorderRadius,
      },
      [`td:last-child${ignoreSsrWarning}, th:last-child${ignoreSsrWarning}`]: {
        borderBottomRightRadius: theme.appBorderRadius,
      },
    },

    tbody: {
      // slightly different than the other DocBlock shadows to account for table styling gymnastics
      boxShadow:
        theme.base === 'light'
          ? `rgba(0, 0, 0, 0.10) 0 1px 3px 1px,
          ${transparentize(0.035, theme.appBorderColor)} 0 0 0 1px`
          : `rgba(0, 0, 0, 0.20) 0 2px 5px 1px,
          ${opacify(0.05, theme.appBorderColor)} 0 0 0 1px`,
      borderRadius: theme.appBorderRadius,

      tr: {
        background: 'transparent',
        overflow: 'hidden',
        [`&:not(:first-child${ignoreSsrWarning})`]: {
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor:
            theme.base === 'light'
              ? darken(0.1, theme.background.content)
              : lighten(0.05, theme.background.content),
        },
      },

      td: {
        background: theme.background.content,
      },
    },
    // End finicky table styling
  },
}));

export enum ArgsTableError {
  NO_COMPONENT = 'No component found',
  ARGS_UNSUPPORTED = 'Args unsupported. See Args documentation for your framework.',
}

export interface ArgsTableRowProps {
  rows: ArgTypes;
  args?: Args;
  updateArgs?: (args: Args) => void;
  compact?: boolean;
}

export interface ArgsTableErrorProps {
  error: ArgsTableError;
}

export type ArgsTableProps = ArgsTableRowProps | ArgsTableErrorProps;

type Rows = ArgType[];
type Subsection = Rows;
type Section = {
  ungrouped: Rows;
  subsections: Record<string, Subsection>;
};
type Sections = {
  ungrouped: Rows;
  sections: Record<string, Section>;
};

const groupRows = (rows: ArgTypes) => {
  const sections: Sections = { ungrouped: [], sections: {} };
  if (!rows) return sections;

  Object.entries(rows).forEach(([key, row]) => {
    const { category, subcategory } = row?.table || {};
    if (category) {
      const section = sections.sections[category] || { ungrouped: [], subsections: {} };
      if (!subcategory) {
        section.ungrouped.push(row);
      } else {
        const subsection = section.subsections[subcategory] || [];
        subsection.push(row);
        section.subsections[subcategory] = subsection;
      }
      sections.sections[category] = section;
    } else {
      sections.ungrouped.push({ key, ...row });
    }
  });
  return sections;
};

/**
 * Display the props for a component as a props table. Each row is a collection of
 * ArgDefs, usually derived from docgen info for the component.
 */
export const ArgsTable: FC<ArgsTableProps> = (props) => {
  const { error } = props as ArgsTableErrorProps;
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }

  const { rows, args, updateArgs, compact } = props as ArgsTableRowProps;

  const groups = groupRows(rows);

  if (Object.keys(groups).length === 0) {
    return <EmptyBlock>No props found for this component</EmptyBlock>;
  }

  let colSpan = 1;
  if (updateArgs) colSpan += 1;
  if (!compact) colSpan += 2;

  const common = { updateArgs, compact };
  return (
    <ResetWrapper>
      <TableWrapper compact={compact} className="docblock-propstable">
        <thead className="docblock-propstable-head">
          <tr>
            <th>Name</th>
            {compact ? null : <th>Description</th>}
            {compact ? null : <th>Default</th>}
            {updateArgs ? <th>Control</th> : null}
          </tr>
        </thead>
        <tbody className="docblock-propstable-body">
          {groups.ungrouped.map((row) => (
            <ArgRow key={row.key} row={row} arg={args && args[row.key]} {...common} />
          ))}
          {Object.entries(groups.sections).map(([category, section]) => (
            <SectionRow key={category} caption={category} level="section" colSpan={colSpan}>
              {section.ungrouped.map((row) => (
                <ArgRow key={row.key} row={row} arg={args && args[row.key]} {...common} />
              ))}
              {Object.entries(section.subsections).map(([subcategory, subsection]) => (
                <SectionRow
                  key={subcategory}
                  caption={subcategory}
                  level="subsection"
                  colSpan={colSpan}
                >
                  {subsection.map((row) => (
                    <ArgRow key={row.key} row={row} arg={args && args[row.key]} {...common} />
                  ))}
                </SectionRow>
              ))}
            </SectionRow>
          ))}
        </tbody>
      </TableWrapper>
    </ResetWrapper>
  );
};
