import React from 'react';
import { PropRow } from './PropRow';
import { PropDef } from './PropDef';
import { Table, Thead, Tbody, Tr, Th } from './Table';

export enum PropsTableError {
  NO_COMPONENT = 'no component',
  PROPS_UNSUPPORTED = 'props unsupported',
}

export interface PropsTableProps {
  rows?: PropDef[];
  error?: PropsTableError;
  // FIXME: table options
}

const PropsTable: React.FunctionComponent<PropsTableProps> = ({ rows, error = null }) => {
  if (error) {
    return <div>{error}</div>;
  }
  return (
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
};

export { PropsTable, PropDef };
