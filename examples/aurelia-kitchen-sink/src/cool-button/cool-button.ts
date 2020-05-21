import { bindable, customElement } from 'aurelia';

export class CoolButton {
  @bindable text: string;

  @bindable buttonType = 'primary';
}
