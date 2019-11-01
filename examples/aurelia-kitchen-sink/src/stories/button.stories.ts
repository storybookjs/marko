import { withKnobs, text, } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { addComponents, storiesOf } from '@storybook/aurelia';
import { CoolButton } from '../cool-button/cool-button';
import 'bootstrap/scss/bootstrap.scss';

storiesOf('Button|Basic', module)
.addDecorator(withKnobs)
.addDecorator(addComponents(CoolButton))
.add('Aurelia - Template', function () {
  let buttonText = text('Button Text', 'Aurelia Rocks!');
  let buttonClick = action('Button Click');
  const state = {
    buttonText,
    buttonClick
  };
  return {
    template: `<template><cool-button click.delegate="buttonClick($event)" text.bind="buttonText"></cool-button></template>`,
    state: state
  };
})
.add('Aurelia - Auto Generate', function () {
  return {
    customElement: CoolButton
  };
});