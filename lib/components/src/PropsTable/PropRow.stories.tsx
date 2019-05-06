import React from 'react';
import { PropRow } from './PropRow';
import { Table, Tbody } from './Table';

export const componentMeta = {
  Component: PropRow,
  title: 'Docs|PropRow',
  decorators: [
    getStory => (
      <Table>
        <Tbody>{getStory()}</Tbody>
      </Table>
    ),
  ],
};

const stringDef = {
  name: 'someString',
  type: { name: 'string' },
  required: true,
  description: 'someString description',
  defaultValue: 'fixme',
};

const numberDef = {
  name: 'someNumber',
  type: { name: 'number' },
  required: false,
  description: 'someNumber description',
  defaultValue: 0,
};

export const string = () => <PropRow row={stringDef} />;
string.def = stringDef;
export const number = () => <PropRow row={numberDef} />;
number.def = numberDef;
