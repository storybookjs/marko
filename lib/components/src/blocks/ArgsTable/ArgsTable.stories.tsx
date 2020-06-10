import React from 'react';
import { ArgsTable, ArgsTableError } from './ArgsTable';
import * as ArgRow from './ArgRow.stories';

export default {
  component: ArgsTable,
  title: 'Docs/ArgsTable',
};

const propsSection = { category: 'props ' };
const eventsSection = { category: 'events ' };

const stringType = ArgRow.String.args.row;
const numberType = ArgRow.Number.args.row;

export const Normal = (args) => <ArgsTable {...args} />;
Normal.args = {
  rows: {
    stringType,
    numberType,
  },
};

export const Compact = (args) => <ArgsTable {...args} />;
Compact.args = {
  ...Normal.args,
  compact: true,
};

const sectionRows = {
  a: { ...stringType, table: { ...stringType.table, ...propsSection } },
  b: { ...numberType, table: { ...stringType.table, ...propsSection } },
  c: { ...stringType, table: { ...stringType.table, ...eventsSection } },
};

export const Sections = (args) => <ArgsTable {...args} />;
Sections.args = {
  rows: sectionRows,
};

export const SectionsCompact = (args) => <ArgsTable {...args} />;
SectionsCompact.args = {
  ...Sections.args,
  compact: true,
};

export const Error = (args) => <ArgsTable {...args} />;
Error.args = {
  error: ArgsTableError.NO_COMPONENT,
};

export const Empty = (args) => <ArgsTable {...args} />;
Empty.args = { rows: {} };
