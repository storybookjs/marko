import React from 'react';
import { storiesOf } from '@storybook/react';
import TypescriptButton from './TypescriptButton';

storiesOf('Legacy|TypescriptButton', module)
  .addParameters({ component: TypescriptButton })
  .add('small', (): any => <TypescriptButton variant="small" />)
  .add('large', (): any => <TypescriptButton variant="large" />);
