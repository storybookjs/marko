import type {
  Args,
  StoryContext as StoryContextBase,
  WebRenderer,
} from "storybook/internal/types";

export type StoryContext<Input extends Args = Args> = StoryContextBase<
  MarkoRenderer<Input>
>;

export interface MarkoRenderer<Input extends Args = Args> extends WebRenderer {
  component: Marko.Template<Input>;
  storyResult: MarkoStoryResult<Input>;
}

export interface MarkoStoryResult<Input extends Args = Args> {
  component?: Marko.Template<Input>;
  input?: Marko.TemplateInput<Input>;
}
