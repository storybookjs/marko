import SplitComponent, { type Input } from "./index.marko";
import type { Meta, Story } from "@storybook/marko";

export default {
  title: "SplitComponent",
  component: SplitComponent,
} as Meta<Input>;

export const HelloWorld = {
  args: { name: "World" },
} as Story<Input>;

export const HelloMarko = ((input) => ({ input })) as Story<Input>;
HelloMarko.args = { name: "Marko" };
