import React from 'react';

import { storiesOf } from '@storybook/react';
import { PropTable } from './PropTable';

const FooComponent = () => <div />;

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
  required: true,
  description: 'someNumber description',
  defaultValue: 0,
};

storiesOf('Basics|PropTable', module)
  .add('empty', () => <PropTable />)
  .add('single', () => <PropTable type={FooComponent} propDefinitions={[stringDef]} />)
  .add('multi', () => <PropTable type={FooComponent} propDefinitions={[stringDef, numberDef]} />);
