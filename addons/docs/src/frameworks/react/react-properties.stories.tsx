import React from 'react';
import { storiesOf } from '@storybook/react';
import { PropsTable } from '@storybook/components';
import { extractProps } from './extractProps';

const fixtures = ['js-class-component', 'ts-function-component'];

const stories = storiesOf('Properties/React', module);

fixtures.forEach(fixture => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { component } = require(`./__testfixtures__/${fixture}/input`);
  const props = extractProps(component);
  stories.add(fixture, () => <PropsTable {...props} />);
});
