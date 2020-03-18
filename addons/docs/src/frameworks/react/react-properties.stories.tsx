import React from 'react';
import { storiesOf } from '@storybook/react';
import { PropsTable } from '@storybook/components';
import { extractProps } from './extractProps';

const fixtures = [
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

const stories = storiesOf('Properties/React', module);

fixtures.forEach(fixture => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { component } = require(`./__testfixtures__/${fixture}/input`);
  const props = extractProps(component);
  stories.add(fixture, () => <PropsTable {...props} />);
});
