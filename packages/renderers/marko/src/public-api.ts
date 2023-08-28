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
const api = start<MarkoRenderer>(renderToCanvas, {
  decorateStory,
  render,
});

export const storiesOf: ClientApi["storiesOf"] = (kind, m) => {
  return (
    api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi["storiesOf"]>
  ).addParameters({
    renderer: RENDERER,
  });
};

export const configure: ClientApi["configure"] = (...args) =>
  api.configure(RENDERER, ...args);
export const forceReRender: ClientApi["forceReRender"] = api.forceReRender;
export const raw: ClientApi["raw"] = api.clientApi.raw;
