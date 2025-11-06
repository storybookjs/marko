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
    join(import.meta.dirname, "entry-preview.mjs"),
    ...(docsEnabled
      ? [join(import.meta.dirname, "entry-preview-docs.mjs")]
      : []),
  ];
};
