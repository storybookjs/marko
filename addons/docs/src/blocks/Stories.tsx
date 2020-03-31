import React, { useContext, FunctionComponent } from 'react';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { Heading } from './Heading';
import { getDocsStories } from './utils';
import { DocsStoryProps } from './shared';

interface StoriesProps {
  title?: JSX.Element | string;
  excludePrimary?: boolean;
}

export const Stories: FunctionComponent<StoriesProps> = ({ title, excludePrimary = true }) => {
  const context = useContext(DocsContext);
  const componentStories = getDocsStories(context);

  let stories: DocsStoryProps[] = componentStories;
  if (excludePrimary) stories = stories.slice(1);

  if (!stories || stories.length === 0) {
    return null;
  }
  return (
    <>
      <Heading>{title}</Heading>
      {stories.map(story => story && <DocsStory key={story.id} {...story} expanded />)}
    </>
  );
};

Stories.defaultProps = {
  title: 'Stories',
};
