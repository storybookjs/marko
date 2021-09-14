import { start } from "@storybook/core/client";
import render from "./render";

const framework = "marko";
const app = start(render);

export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = app.clientApi;

export const { forceReRender } = app;

/**
 * @deprecated
 */
export const storiesOf = (kind: string, m: any) =>
  app.clientApi.storiesOf(kind, m).addParameters({ framework });

/**
 * @deprecated
 */
export const configure = (loadable: any, m: any) =>
  app.configure(framework, loadable, m);
