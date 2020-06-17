import React from 'react';
import { action } from '@storybook/addon-actions';
import { ArgsTable, ArgsTableError } from './ArgsTable';
import * as ArgRow from './ArgRow.stories';

export default {
  component: ArgsTable,
  title: 'Docs/ArgsTable',
  args: {
    updateArgs: action('updateArgs'),
  },
};

const propsSection = { category: 'props ' };
const eventsSection = { category: 'events ' };

const componentSubsection = { subcategory: 'MyComponent ' };
const htmlElementSubsection = { subcategory: 'HTMLElement' };

const stringType = ArgRow.String.args.row;
const numberType = ArgRow.Number.args.row;

const Story = (args) => <ArgsTable {...args} />;

export const Normal = Story.bind({});
Normal.args = {
  rows: {
    stringType,
    numberType,
  },
};

export const Compact = Story.bind({});
Compact.args = {
  ...Normal.args,
  compact: true,
};

const sectionRows = {
  a: { ...stringType, table: { ...stringType.table, ...propsSection } },
  b: { ...numberType, table: { ...stringType.table, ...propsSection } },
  c: { ...stringType, table: { ...stringType.table, ...eventsSection } },
};

const subsectionRows = {
  a: { ...stringType, table: { ...stringType.table, ...propsSection, ...componentSubsection } },
  b: { ...numberType, table: { ...stringType.table, ...propsSection, ...componentSubsection } },
  c: { ...stringType, table: { ...stringType.table, ...eventsSection, ...componentSubsection } },
  d: { ...stringType, table: { ...stringType.table, ...eventsSection, ...htmlElementSubsection } },
};

export const Sections = Story.bind({});
Sections.args = {
  rows: sectionRows,
};

export const SectionsCompact = Story.bind({});
SectionsCompact.args = {
  ...Sections.args,
  compact: true,
};

export const Subsections = Story.bind({});
Subsections.args = {
  rows: subsectionRows,
};

export const Error = Story.bind({});
Error.args = {
  error: ArgsTableError.NO_COMPONENT,
};

export const Empty = Story.bind({});
Empty.args = { rows: {} };
