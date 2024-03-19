import { sanitizeStoryContextUpdate } from "@storybook/preview-api";
import type { Args, DecoratorApplicator, StoryContext } from "@storybook/types";
import type { MarkoRenderer, MarkoStoryResult } from "./types";

export const applyDecorators: DecoratorApplicator<MarkoRenderer, Args> = (
  storyFn,
  decorators,
) =>
  decorators.reduce(
    (decorated, decorator) =>
      (context: StoryContext<MarkoRenderer>): MarkoStoryResult => {
        let story: MarkoStoryResult | undefined;
        const decoratedStory: MarkoStoryResult = decorator((update) => {
          story = decorated({
            ...context,
            ...sanitizeStoryContextUpdate(update),
          });
          return story;
        }, context);

        story ||= decorated(context);
        return decoratedStory === story
          ? story
          : {
              component: decoratedStory.component || context.component,
              input: {
                ...decoratedStory.input,
                renderBody(out: Marko.Out) {
                  story?.component?.render(story.input || {}, out);
                },
              },
            };
      },
    (context: StoryContext<MarkoRenderer>): MarkoStoryResult =>
      storyFn(context),
  );
