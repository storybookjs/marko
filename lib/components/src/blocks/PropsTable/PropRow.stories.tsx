import React from 'react';
import { PropRow } from './PropRow';

import { Table } from './PropsTable';
import { Wrapper as DocsPageWrapper } from '../DocsPage';

export const componentMeta = {
  Component: PropRow,
  title: 'Docs|PropRow',
  decorators: [
    getStory => (
      <DocsPageWrapper>
        <Table>
          <tbody>{getStory()}</tbody>
        </Table>
      </DocsPageWrapper>
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

const longNameDef = {
  ...stringDef,
  name: 'reallyLongStringThatTakesUpSpace',
};

const longDescDef = {
  ...stringDef,
  description: 'really long description that takes up a lot of space. sometimes this happens.',
};

const numberDef = {
  name: 'someNumber',
  type: { name: 'number' },
  required: false,
  description: 'someNumber description',
  defaultValue: 0,
};

export const string = () => <PropRow row={stringDef} />;
export const longName = () => <PropRow row={longNameDef} />;
export const longDesc = () => <PropRow row={longDescDef} />;
export const number = () => <PropRow row={numberDef} />;
