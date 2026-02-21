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
     * - Pass `true` to add an english-language description written by Marko team
     * - Pass a string to use it as the description
     * - Pass a function to build a description using the name
     *
     * For further customization, add a `_Change` argType manually
     */
    changeHandler?: true | string | ((name: string) => string);
    /**
     * **_[Marko]_**
     *
     * This arg may be passed as an [attribute tag](https://markojs.com/docs/reference/language#attribute-tags).
     *
     * The value acts as `argTypes` for this attribute tag.
     */
    "@"?: Record<string, InputType>;
  }
}
