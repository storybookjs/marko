import { withDocgenInfo } from "@storybook/marko/docgen";
import type { LoaderContext } from "webpack";

export default function markoDocgenLoader(
  this: LoaderContext<unknown>,
  source: string,
  map: Parameters<LoaderContext<unknown>["callback"]>[2],
): void {
  const callback = this.async();
  // Never rejects: docs are best effort.
  withDocgenInfo(source, this.resourcePath).then((result) => {
    for (const dependency of result?.dependencies || []) {
      this.addDependency(dependency);
    }
    // Positions are unchanged, so the incoming source map still applies.
    callback(null, result?.code ?? source, map);
  });
}
