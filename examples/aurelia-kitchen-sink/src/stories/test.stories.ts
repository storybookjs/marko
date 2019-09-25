import { storiesOf } from '@storybook/aurelia';
import { withKnobs, text } from '@storybook/addon-knobs';
import { addComponents } from '@storybook/aurelia/dist/client/preview/decorators';
import { CoolButton } from '../cool-button/cool-button';
import 'bootstrap/dist/css/bootstrap.css';

const t = storiesOf('Button|Basic', module);
t.addDecorator(withKnobs);

t.add('Cool', () => {
  const name = text('asdf', 'asfdasfd');

  return {
    container: undefined,
    customElement: undefined,
    items: undefined,
    template: `<template>${name}<cool-button></cool-button></template>`,
  };
}).add(
  'Test',
  () => ({
    container: undefined,
    customElement: undefined,
    items: undefined,
    template: '<template>asdfasdfasdfas<test-button></test-button></template>',
  }),
  null
);
