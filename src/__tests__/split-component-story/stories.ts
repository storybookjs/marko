import type { Story, Meta } from "../../client";
import SplitComponent from "./index.marko";

interface Input {
  name?: string;
}
const Template: Story<Input> = (input) => ({ input });

export default {
  title: "SplitComponent",
  component: SplitComponent,
} as Meta<Input>;

export const HelloWorld = Template.bind({});
HelloWorld.args = { name: "World" };

export const HelloMarko = Template.bind({});
HelloMarko.args = { name: "Marko" };
