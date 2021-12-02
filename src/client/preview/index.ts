import { start } from "@storybook/core/client";
import { renderToDOM, render } from "./render";

const framework = "marko";
const app = start(renderToDOM, { render });

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
export const configure = (
  loadable: any,
  m: any,
  showDeprecationWarning: boolean
) => app.configure(framework, loadable, m, showDeprecationWarning);
