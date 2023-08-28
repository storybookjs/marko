declare module "*.marko" {
  import { Template } from "marko";
  const template: Template;
  export type Input = any;
  export default template;
}
