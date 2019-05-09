import React from 'react';
import { PropsTable, PropsTableError } from './PropsTable';
import * as rowStories from './PropRow.stories';

export const componentMeta = {
  Component: PropsTable,
  title: 'Docs|PropTable',
};

export const error = () => <PropsTable error={PropsTableError.NO_COMPONENT} />;

export const empty = () => <PropsTable rows={[]} />;

const { row: stringRow } = rowStories.string().props;
const { row: numberRow } = rowStories.number().props;
export const normal = () => <PropsTable rows={[stringRow, numberRow]} />;
