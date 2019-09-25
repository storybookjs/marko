import { bindable } from '@aurelia/runtime';
import 'bootstrap/scss/bootstrap.scss';
import { text } from '@storybook/addon-knobs';

export class CoolButton {
  @bindable text = text('asdfads', 'asdfasdf');
}
