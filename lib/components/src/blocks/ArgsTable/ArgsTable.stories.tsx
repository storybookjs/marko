import React from 'react';
import { action } from '@storybook/addon-actions';
import { styled } from '@storybook/theming';
import { ArgsTable, ArgsTableError } from './ArgsTable';
import { NoControlsWarning } from './NoControlsWarning';
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

const AddonPanelLayout = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  background: theme.background.content,
}));

export const InAddonPanel = Story.bind({});
InAddonPanel.args = {
  ...Normal.args,
  inAddonPanel: true,
};
InAddonPanel.decorators = [(storyFn) => <AddonPanelLayout>{storyFn()}</AddonPanelLayout>];

export const InAddonPanelWithWarning = (args) => (
  <>
    <NoControlsWarning />
    <ArgsTable {...args} />
  </>
);
InAddonPanelWithWarning.args = {
  ...InAddonPanel.args,
  updateArgs: null,
};
InAddonPanelWithWarning.decorators = InAddonPanel.decorators;

export const Sections = Story.bind({});
Sections.args = {
  rows: {
    a: { ...stringType, table: { ...stringType.table, ...propsSection } },
    b: { ...numberType, table: { ...stringType.table, ...propsSection } },
    c: { ...stringType, table: { ...stringType.table, ...eventsSection } },
  },
};

export const SectionsCompact = Story.bind({});
SectionsCompact.args = {
  ...Sections.args,
  compact: true,
};

export const SectionsAndSubsections = Story.bind({});
SectionsAndSubsections.args = {
  rows: {
    a: { ...stringType, table: { ...stringType.table, ...propsSection, ...componentSubsection } },
    b: { ...numberType, table: { ...stringType.table, ...propsSection, ...componentSubsection } },
    c: { ...stringType, table: { ...stringType.table, ...eventsSection, ...componentSubsection } },
    d: {
      ...stringType,
      table: { ...stringType.table, ...eventsSection, ...htmlElementSubsection },
    },
  },
};

export const SubsectionsOnly = Story.bind({});
SubsectionsOnly.args = {
  rows: {
    a: { ...stringType, table: { ...stringType.table, ...componentSubsection } },
    b: { ...numberType, table: { ...stringType.table, ...componentSubsection } },
    c: { ...stringType, table: { ...stringType.table, ...componentSubsection } },
    d: { ...stringType, table: { ...stringType.table, ...htmlElementSubsection } },
  },
};

export const AllControls = Story.bind({});
AllControls.args = {
  rows: {
    array: ArgRow.ArrayOf.args.row,
    boolean: ArgRow.Boolean.args.row,
    color: ArgRow.Color.args.row,
    date: ArgRow.Date.args.row,
    string: ArgRow.String.args.row,
    number: ArgRow.Number.args.row,
    range: ArgRow.Number.args.row,
    radio: ArgRow.Radio.args.row,
    inlineRadio: ArgRow.InlineRadio.args.row,
    check: ArgRow.Check.args.row,
    inlineCheck: ArgRow.InlineCheck.args.row,
    select: ArgRow.Select.args.row,
    multiSelect: ArgRow.MultiSelect.args.row,
    object: ArgRow.ObjectOf.args.row,
    func: ArgRow.Func.args.row,
  },
};

export const Error = Story.bind({});
Error.args = {
  error: ArgsTableError.NO_COMPONENT,
};

export const Empty = Story.bind({});
Empty.args = { rows: {} };
