import { text, withKnobs } from '@storybook/addon-knobs';
import { titleCase } from 'title-case';

import stories from '../server/stories';

const storyBookStories = Object.keys(stories).map(component => {
  const storybookDescription = {
    default: {
      title: component,
      decorators: [withKnobs],
    },
  };
  const componentStories = stories[component];
  Object.keys(componentStories).forEach(storyName => {
    const componentStory = componentStories[storyName];

    storybookDescription[storyName] = () => {
      // Build the list of knobs from the stroy arguments. Assume that all arguments are text.
      // More sophisticated server backends could have DSLs to provide other types.
      const knobs = {};
      Object.keys(componentStory).forEach(argument => {
        const name = titleCase(argument);
        const defaultValue = componentStory[argument];
        knobs[argument] = text(name, defaultValue);
      });
      return knobs;
    };
  });

  return storybookDescription;
});

export default storyBookStories;
