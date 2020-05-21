import { bindable } from 'aurelia';

export class CoolButton {
  @bindable text: string;

  @bindable buttonType = 'primary';
}
