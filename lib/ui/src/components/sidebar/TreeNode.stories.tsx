import React from 'react';
import { HighlightStyles } from './HighlightStyles';

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
    <HighlightStyles refId="foo" itemId="bar" />
    <StoryNode data-ref-id="baz" data-item-id="bar" data-nodetype="story" data-selected="false">
      Default story
    </StoryNode>
    <StoryNode data-ref-id="baz" data-item-id="bar" data-nodetype="story" data-selected="true">
      Selected story
    </StoryNode>
    <StoryNode data-ref-id="foo" data-item-id="bar" data-nodetype="story" data-selected="false">
      Highlighted story
    </StoryNode>
    <StoryNode data-ref-id="foo" data-item-id="bar" data-nodetype="story" data-selected="true">
      Highlighted + Selected story
    </StoryNode>
    <GroupNode data-ref-id="foo" data-item-id="baz" data-nodetype="group" data-selected="false">
      Default group
    </GroupNode>
    <GroupNode data-ref-id="foo" data-item-id="bar" data-nodetype="group" data-selected="false">
      Highlighted group
    </GroupNode>
  </>
);
