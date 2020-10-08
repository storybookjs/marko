import React from 'react';

import { ComponentNode, DocumentNode, GroupNode, StoryNode } from './TreeNode';

export default {
  title: 'UI/Sidebar/TreeNode',
  parameters: { layout: 'fullscreen' },
};

export const Types = () => (
  <>
    <ComponentNode>Component</ComponentNode>
    <GroupNode>Group</GroupNode>
    <StoryNode>Story</StoryNode>
    <DocumentNode>Document</DocumentNode>
  </>
);

export const Expandable = () => (
  <>
    <ComponentNode isExpandable>Collapsed component</ComponentNode>
    <ComponentNode isExpandable isExpanded>
      Expanded component
    </ComponentNode>
    <GroupNode isExpandable>Collapsed group</GroupNode>
    <GroupNode isExpandable isExpanded>
      Expanded group
    </GroupNode>
  </>
);

export const Nested = () => (
  <>
    <DocumentNode depth={0}>Zero</DocumentNode>
    <GroupNode isExpandable isExpanded depth={0}>
      Zero
    </GroupNode>
    <GroupNode isExpandable isExpanded depth={1}>
      One
    </GroupNode>
    <StoryNode depth={2}>Two</StoryNode>
    <ComponentNode isExpandable isExpanded depth={2}>
      Two
    </ComponentNode>
    <StoryNode depth={3}>Three</StoryNode>
  </>
);

export const Selection = () => (
  <>
    <StoryNode>Default story</StoryNode>
    <StoryNode isSelected>Selected story</StoryNode>
    <StoryNode isHighlighted>Highlighted story</StoryNode>
    <StoryNode isHighlighted isSelected>
      Highlighted + Selected story
    </StoryNode>
    <GroupNode>Default group</GroupNode>
    <GroupNode isHighlighted>Highlighted group</GroupNode>
  </>
);
