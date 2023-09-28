import type { Addon_ClientStoryApi, Addon_Loadable } from "@storybook/types";
import { start } from "@storybook/preview-api";
import { decorateStory } from "./decorators";
import { render, renderToCanvas } from "./render";
import type { MarkoRenderer } from "./types";

interface ClientApi extends Addon_ClientStoryApi<MarkoRenderer["storyResult"]> {
  configure(loader: Addon_Loadable, module: NodeModule): void;
  forceReRender(): void;
  raw: () => any; // todo add type
}

const RENDERER = "marko" as const;
let api: ReturnType<typeof start<MarkoRenderer>>;

/**
 * @deprecated
 */
export const storiesOf: ClientApi["storiesOf"] = (kind, m) =>
  (
    getApi().clientApi.storiesOf(kind, m) as ReturnType<ClientApi["storiesOf"]>
  ).addParameters({
    renderer: RENDERER,
  });

/**
 * @deprecated
 */
export const configure: ClientApi["configure"] = (...args) =>
  getApi().configure(RENDERER, ...args);

/**
 * @deprecated
 */
export const forceReRender: ClientApi["forceReRender"] = (...args) =>
  getApi().forceReRender(...args);

/**
 * @deprecated
 */
export const raw: ClientApi["raw"] = (...args) =>
  getApi().clientApi.raw(...args);

function getApi() {
  api ||= start<MarkoRenderer>(renderToCanvas, {
    decorateStory,
    render,
  });
  return api;
}
