import React from 'react';

import { storiesOf } from '@storybook/react';
import { PropTable } from './PropTable';

const stringDef = {
  property: 'someString',
  propType: { name: 'string' },
  required: true,
  description: 'someString description',
  defaultValue: 'fixme',
};

const numberDef = {
  property: 'someNumber',
  propType: { name: 'number' },
  required: false,
  description: 'someNumber description',
  defaultValue: 0,
};

storiesOf('Basics|PropTable', module)
  .add('empty', () => <PropTable />)
  .add('single', () => <PropTable propDefinitions={[stringDef]} />)
  .add('multi', () => <PropTable propDefinitions={[stringDef, numberDef]} />);
