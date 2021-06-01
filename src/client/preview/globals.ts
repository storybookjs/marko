/* istanbul ignore next: Not actively testing running client non browser environments */
const globalWindow = (
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : {}
) as Record<string, unknown>;

globalWindow.STORYBOOK_ENV = "marko";

export default globalWindow;
