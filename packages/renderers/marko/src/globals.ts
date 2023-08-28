import { global as scope } from "@storybook/global";

const globalWindow = scope.window as any;
if (globalWindow) {
  globalWindow.STORYBOOK_ENV = "marko";
}
