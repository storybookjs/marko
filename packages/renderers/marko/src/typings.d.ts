declare const STORYBOOK_ENV: "marko";
declare const LOGLEVEL:
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "silent"
  | undefined;

// Empty import makes this file a module so "declare module" augments instead of replacing
import type {} from "storybook/internal/csf";

declare module "storybook/internal/csf" {
  interface InputType {
    /**
     * **_[Marko]_**
     *
     * Indicates that this arg is [controllable](https://markojs.com/docs/explanation/controllable-components#the-controllable-pattern) via a `_Change` handler.
     *
     * Pass `true` to add an english-language description written by Marko team
     *
     * Pass a string to use it as the description
     *
     * Pass a function to build a description from this argType
     *
     * For further customization, add a `_Change` argType manually
     */
    changeHandler?: true | string | ((name: string) => string);
  }
}
