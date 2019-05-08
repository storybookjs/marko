import React from 'react';
import { PropsTable } from './PropsTable';
import { string, number } from './PropRow.stories';

export const componentMeta = {
  Component: PropsTable,
  title: 'Docs|PropTable',
};

export const empty = () => <PropsTable rows={[]} />;

const normalProps = {
  rows: [string.def, number.def],
};
export const normal = () => <PropsTable {...normalProps} />;
normal.props = normalProps;
