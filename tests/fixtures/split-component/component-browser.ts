export interface Input {
  name: string;
}

export default class extends Marko.Component<Input> {
  onMount() {
    this.emit("mounted");
  }
}
