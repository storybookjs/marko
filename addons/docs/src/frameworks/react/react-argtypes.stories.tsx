import React from 'react';
import { storiesOf } from '@storybook/react';
import { ArgsTable, ArgsTableProps } from '@storybook/components';
import { action } from '@storybook/addon-actions';
import { Args } from '@storybook/api';
import { combineParameters } from '@storybook/client-api';

import { extractArgTypes } from './extractArgTypes';
import { inferControls } from '../common/inferControls';
import { Component } from '../../blocks';

const argsTableProps = (component: Component): ArgsTableProps => {
  const argTypes = extractArgTypes(component);
  const args = Object.keys(argTypes).reduce((acc, key) => {
    acc[key] = null;
    return acc;
  }, {} as Args);
  const controls = inferControls(argTypes);
  const rows = combineParameters(argTypes, controls);
  return { rows, args };
};

const typescriptFixtures = [
  'aliases',
  'arrays',
  'enums',
  'functions',
  'interfaces',
  'intersections',
  'records',
  'scalars',
  'tuples',
  'unions',
];

const typescriptStories = storiesOf('ArgTypes/TypeScript', module);
typescriptFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require, no-shadow
  const { Component } = require(`../../lib/sbtypes/__testfixtures__/typescript/${fixture}`);
  const props = argsTableProps(Component);

  typescriptStories.add(fixture, () => <ArgsTable {...props} updateArgs={action('updateArgs')} />);
});

const proptypesFixtures = ['arrays', 'enums', 'misc', 'objects', 'react', 'scalars'];

const proptypesStories = storiesOf('ArgTypes/PropTypes', module);
proptypesFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require, no-shadow
  const { Component } = require(`../../lib/sbtypes/__testfixtures__/proptypes/${fixture}`);
  const props = argsTableProps(Component);

  proptypesStories.add(fixture, () => <ArgsTable {...props} updateArgs={action('updateArgs')} />);
});

const issuesFixtures = [
  'js-class-component',
  'ts-function-component',
  '9399-js-proptypes-shape',
  '8663-js-styled-components',
  '9626-js-default-values',
  '9668-js-proptypes-no-jsdoc',
  '8143-ts-react-fc-generics',
  '8143-ts-imported-types',
  '8279-js-styled-docgen',
  '8140-js-prop-types-oneof',
  '9023-js-hoc',
  '8740-ts-multi-props',
  '9556-ts-react-default-exports',
  '9592-ts-styled-props',
  '9591-ts-import-types',
  '9721-ts-deprecated-jsdoc',
  '9827-ts-default-values',
  '9586-js-react-memo',
  '9575-ts-camel-case',
  '9493-ts-display-name',
  '8894-9511-ts-forward-ref',
  '9465-ts-type-props',
  '8428-js-static-prop-types',
  '9764-ts-extend-props',
  '9922-ts-component-props',
];

const issuesStories = storiesOf('ArgTypes/Issues', module);
issuesFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { component } = require(`./__testfixtures__/${fixture}/input`);
  const props = argsTableProps(component);

  issuesStories.add(fixture, () => <ArgsTable {...props} updateArgs={action('updateArgs')} />);
});
