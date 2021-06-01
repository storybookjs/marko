import build from "@storybook/core/standalone";
import frameworkOptions from "./server/options";

export default async function buildStandalone(
  options: Parameters<typeof build>[0]
) {
  return build(options, frameworkOptions);
}
