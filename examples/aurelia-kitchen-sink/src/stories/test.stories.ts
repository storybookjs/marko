import { storiesOf } from '@storybook/aurelia';
import { withKnobs, text } from '@storybook/addon-knobs';
import { addComponents } from '@storybook/aurelia/dist/client/preview/decorators';
import { CoolButton } from '../cool-button/cool-button';
import 'bootstrap/dist/css/bootstrap.css';

const t = storiesOf('Button|Basic', module);
t.addDecorator(withKnobs);
t.addDecorator(addComponents(CoolButton));

t.add('Cool', () => {
  return {
    template: `<template>\${text}<cool-button text.bind="text"></cool-button></template>`,
    state: { text: text('asdf', 'TEXT') },
  };
}).add(
  'Test',
  () => ({
    template: '<template>asdfasdfasdfas<test-button></test-button></template>',
  }),
  null
);
