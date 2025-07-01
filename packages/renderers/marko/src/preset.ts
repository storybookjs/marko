import { join } from "path";
import type { PresetProperty } from "storybook/internal/types";

export const previewAnnotations: PresetProperty<"previewAnnotations"> = async (
  input = [],
  options,
) => {
  const docsEnabled =
    Object.keys(await options.presets.apply("docs", {}, options)).length > 0;
  return [
    ...input,
    join(__dirname, "entry-preview.mjs"),
    ...(docsEnabled ? [join(__dirname, "entry-preview-docs.mjs")] : []),
  ];
};
