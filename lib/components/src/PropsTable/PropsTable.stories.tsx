import React from 'react';
import { PropsTable } from './PropsTable';
import { string, number } from './PropRow.stories';

export const componentMeta = {
  Component: PropsTable,
  title: 'Docs|PropTable',
};

export const empty = () => <PropsTable rows={[]} />;
export const all = () => <PropsTable rows={[string.def, number.def]} />;
