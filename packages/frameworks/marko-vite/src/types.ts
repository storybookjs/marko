import type {
  BuilderOptions,
  StorybookConfigVite,
} from "@storybook/builder-vite";
import type {
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as TypescriptOptionsBase,
} from "@storybook/types";

type FrameworkName = "@storybook/marko-vite" | (string & NonNullable<unknown>);
type BuilderName = "@storybook/builder-vite" | (string & NonNullable<unknown>);

export type FrameworkOptions = {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase["core"] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
  typescript?: Partial<TypescriptOptionsBase> &
    StorybookConfigBase["typescript"];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigVite | keyof StorybookConfigFramework
> &
  StorybookConfigVite &
  StorybookConfigFramework;
