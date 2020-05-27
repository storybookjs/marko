import React from 'react';
import { ArgsTable, ArgsTableError } from './ArgsTable';
import { stringType, numberType } from './ArgRow.stories';

export default {
  component: ArgsTable,
  title: 'Docs/ArgsTable',
};

const propsSection = { category: 'props ' };
const eventsSection = { category: 'events ' };

export const Normal = () => <ArgsTable rows={{ stringType, numberType }} />;

export const Compact = () => <ArgsTable compact rows={{ stringType, numberType }} />;

const sectionRows = {
  a: { ...stringType, table: { ...stringType.table, ...propsSection } },
  b: { ...numberType, table: { ...stringType.table, ...propsSection } },
  c: { ...stringType, table: { ...stringType.table, ...eventsSection } },
};

export const Sections = () => <ArgsTable rows={sectionRows} />;

export const SectionsCompact = () => <ArgsTable compact rows={sectionRows} />;

export const Error = () => <ArgsTable error={ArgsTableError.NO_COMPONENT} />;

export const Empty = () => <ArgsTable rows={{}} />;
