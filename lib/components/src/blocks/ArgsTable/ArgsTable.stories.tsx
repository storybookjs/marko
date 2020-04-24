import React from 'react';
import { ArgsTable, ArgsTableError } from './ArgsTable';
import { stringType, numberType } from './ArgRow.stories';

export default {
  component: ArgsTable,
  title: 'Docs/ArgsTable',
};

const propsSection = { category: 'props ' };
const eventsSection = { category: 'events ' };

export const normal = () => <ArgsTable rows={{ stringType, numberType }} />;

export const sections = () => (
  <ArgsTable
    rows={{
      a: { ...stringType, table: { ...stringType.table, ...propsSection } },
      b: { ...numberType, table: { ...stringType.table, ...propsSection } },
      c: { ...stringType, table: { ...stringType.table, ...eventsSection } },
    }}
  />
);

export const error = () => <ArgsTable error={ArgsTableError.NO_COMPONENT} />;

export const empty = () => <ArgsTable rows={{}} />;
