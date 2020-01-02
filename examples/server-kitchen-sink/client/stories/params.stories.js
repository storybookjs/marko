export default {
  title: 'Params',
  parameters: {
    componentSubtitle: 'Handy status label',
    server: {
      params: { color: 'red' },
    },
  },
};

export const Story = () => {};
Story.story = {
  parameters: {
    server: {
      id: 'params/story',
      params: { message: 'Hello World' },
    },
  },
};

export const Override = () => {};
Override.story = {
  parameters: {
    docs: { component: 'hi there docs' },
    server: {
      id: 'params/override',
      params: { message: 'Hello World', color: 'green' },
    },
  },
};
export const StoryFnOverride = () => {
  return { message: 'Hi World!', color: 'blue' };
};
StoryFnOverride.story = {
  parameters: {
    server: {
      id: 'params/story_fn_override',
      params: { message: 'Hello World', color: 'green' },
    },
  },
};
