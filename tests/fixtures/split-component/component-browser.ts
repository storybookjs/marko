export interface Input {
  name: string;
  content: Marko.Body;
}

export default class extends Marko.Component<Input> {
  onMount() {
    this.emit("mounted");
  }
}
