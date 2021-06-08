import type EventEmitter from "events";

export default {
  onMount(this: EventEmitter) {
    this.emit("mounted");
  },
};
