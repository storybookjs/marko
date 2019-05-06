import React from 'react';
import { styled } from '@storybook/theming';
import { PropRow } from './PropRow';
import { PropDef } from './PropDef';
import { Table, Thead, Tbody, Tr, Th } from './Table';

interface PropsTableProps {
  rows: PropDef[];
  // FIXME: table options
}

export const PropsTable: React.FunctionComponent<PropsTableProps> = ({ rows }) => (
  <Table className="props-table">
    <Thead>
      <Tr>
        <Th>name</Th>
        <Th>description</Th>
        <Th>default</Th>
      </Tr>
    </Thead>
    <Tbody>
      {rows.map(row => (
        <PropRow key={row.name} row={row} />
      ))}
    </Tbody>
  </Table>
);
