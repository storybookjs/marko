import { SourceType, enhanceArgTypes } from "@storybook/docs-tools";
import type {
  Addon_DecoratorFunction,
  ArgTypesEnhancer,
} from "@storybook/types";

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
