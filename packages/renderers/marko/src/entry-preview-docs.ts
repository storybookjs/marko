import { SourceType, enhanceArgTypes } from "storybook/internal/docs-tools";
import type {
  Addon_DecoratorFunction,
  ArgTypesEnhancer,
} from "storybook/internal/types";

import type { MarkoStoryResult } from "./types";

export const decorators: Addon_DecoratorFunction<MarkoStoryResult>[] = [];

export const parameters = {
  docs: {
    story: { inline: true },
    source: {
      type: SourceType.DYNAMIC,
      language: "marko",
    },
  },
};

export const argTypesEnhancers: ArgTypesEnhancer[] = [enhanceArgTypes];

export { applyDecorators } from "./decorators";
