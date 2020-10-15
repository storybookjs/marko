import React, { FunctionComponent } from 'react';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import { Subheading } from './Subheading';
import { DocsStoryProps } from './types';
import { Anchor } from './Anchor';
import { Description } from './Description';
import { Story } from './Story';
import { Canvas } from './Canvas';

const warnStoryDescription = deprecate(
  () => {},
  dedent`
    Deprecated parameter: docs.storyDescription => docs.description.story
      
    https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#docs-description-parameter
  `
);

export const DocsStory: FunctionComponent<DocsStoryProps> = ({
  id,
  name,
  expanded = true,
  withToolbar = false,
  parameters = {},
}) => {
  let description;
  const { docs } = parameters;
  if (expanded && docs) {
    description = docs.description?.story;
    if (!description) {
      description = docs.storyDescription;
      if (description) warnStoryDescription();
    }
  }

  const subheading = expanded && name;

  return (
    <Anchor storyId={id}>
      {subheading && <Subheading>{subheading}</Subheading>}
      {description && <Description markdown={description} />}
      <Canvas withToolbar={withToolbar}>
        <Story id={id} />
      </Canvas>
    </Anchor>
  );
};
