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

const ArgsTableStory = (args) => <ArgsTable {...args} />;

export const Normal = ArgsTableStory.bind({});
Normal.args = {
  rows: {
    stringType,
    numberType,
  },
};

export const Compact = ArgsTableStory.bind({});
Compact.args = {
  ...Normal.args,
  compact: true,
};

const sectionRows = {
  a: { ...stringType, table: { ...stringType.table, ...propsSection } },
  b: { ...numberType, table: { ...stringType.table, ...propsSection } },
  c: { ...stringType, table: { ...stringType.table, ...eventsSection } },
};

export const Sections = ArgsTableStory.bind({});
Sections.args = {
  rows: sectionRows,
};

export const SectionsCompact = ArgsTableStory.bind({});
SectionsCompact.args = {
  ...Sections.args,
  compact: true,
};

export const Error = ArgsTableStory.bind({});
Error.args = {
  error: ArgsTableError.NO_COMPONENT,
};

export const Empty = ArgsTableStory.bind({});
Empty.args = { rows: {} };
