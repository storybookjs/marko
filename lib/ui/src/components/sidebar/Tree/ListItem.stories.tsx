import React, { ComponentProps, Fragment } from 'react';

import { ListItem } from './ListItem';

export default {
  component: ListItem,
  title: 'UI/Sidebar/ListItem',
  decorators: [(storyFn: any) => <div style={{ width: '240px' }}>{storyFn()}</div>],
};

const baseProps: ComponentProps<typeof ListItem> = {
  depth: 0,
  id: 'foo-bar',
  isComponent: false,
  isLeaf: false,
  isExpanded: false,
  isSelected: false,
  kind: 'foo',
  name: 'bar',
  parameters: {},
  refId: '',
};

export const Group = () => <ListItem {...baseProps} />;
export const Component = () => <ListItem {...baseProps} isComponent />;
export const ComponentExpanded = () => <ListItem {...baseProps} isComponent isExpanded />;
export const Story = () => <ListItem {...baseProps} isLeaf />;
export const StorySelected = () => <ListItem {...baseProps} isLeaf isSelected />;
export const WithLongName = () => (
  <ListItem
    {...baseProps}
    name="Holy cow this is a very very very long name to be in this tiny area."
  />
);
export const NestedDepths = () => (
  <Fragment>
    <ListItem {...baseProps} depth={1} />
    <ListItem {...baseProps} depth={2} />
    <ListItem {...baseProps} depth={3} />
    <ListItem {...baseProps} depth={4} />
  </Fragment>
);
