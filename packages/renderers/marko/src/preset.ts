import { join } from "path";
import type { PresetProperty } from "storybook/internal/types";

import { isDocsEnabled } from "./docgen";

export const previewAnnotations: PresetProperty<"previewAnnotations"> = async (
  input = [],
  options,
) => {
  return [
    ...input,
    join(import.meta.dirname, "entry-preview.mjs"),
    ...((await isDocsEnabled(options))
      ? [join(import.meta.dirname, "entry-preview-docs.mjs")]
      : []),
  ];
};
