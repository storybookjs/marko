/**
 * A split component that greets someone and renders body content.
 */
export interface Input {
  /** Who to greet. */
  name: string;
  /** Content rendered below the greeting. */
  content: Marko.Body;
}

export default class extends Marko.Component<Input> {
  onMount() {
    this.emit("mounted");
  }
}
