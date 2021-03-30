import React from 'react';
import type { StoriesHash } from '@storybook/api';

import { Tree } from './Tree';
import { stories } from './mockdata.large';
import { DEFAULT_REF_ID } from './data';

export default {
  component: Tree,
  title: 'UI/Sidebar/Tree',
  excludeStories: /.*Data$/,
  parameters: { layout: 'fullscreen' },
  decorators: [(storyFn: any) => <div style={{ maxWidth: '230px' }}>{storyFn()}</div>],
};

const refId = DEFAULT_REF_ID;
const storyId = Object.values(stories).find((story) => story.isLeaf && !story.isComponent).id;

const log = (id: string) => console.log(id);

export const Full = () => {
  const [selectedId, setSelectedId] = React.useState(storyId);
  return (
    <Tree
      isBrowsing
      isMain
      refId={refId}
      data={stories}
      highlightedRef={{ current: { itemId: selectedId, refId } }}
      setHighlightedItemId={log}
      selectedStoryId={selectedId}
      onSelectStoryId={setSelectedId}
    />
  );
};

const singleStoryComponent = {
  single: {
    name: 'Single',
    id: 'single',
    parent: false,
    depth: 0,
    children: ['single--single'],
    isComponent: true,
    isLeaf: false,
    isRoot: false,
    label: <span>🔥 Single</span>,
  },
  'single--single': {
    id: 'single--single',
    kind: 'Single',
    name: 'Single',
    story: 'Single',
    args: {},
    argTypes: {},
    initialArgs: {},
    depth: 1,
    parent: 'single',
    isLeaf: true,
    isComponent: false,
    isRoot: false,
    label: <span>🔥 Single</span>,
  },
};

const tooltipStories = Object.keys(stories).reduce((acc, key) => {
  if (key === 'tooltip-tooltipselect--default') {
    acc['tooltip-tooltipselect--tooltipselect'] = {
      ...stories[key],
      id: 'tooltip-tooltipselect--tooltipselect',
      name: 'TooltipSelect',
    };
    return acc;
  }
  if (key === 'tooltip-tooltipselect') {
    acc[key] = { ...stories[key], children: ['tooltip-tooltipselect--tooltipselect'] };
    return acc;
  }
  if (key.startsWith('tooltip')) acc[key] = stories[key];
  return acc;
}, {} as StoriesHash);

export const SingleStoryComponents = () => {
  const [selectedId, setSelectedId] = React.useState('tooltip-tooltipbuildlist--default');
  return (
    <Tree
      isBrowsing
      isMain
      refId={refId}
      data={{ ...singleStoryComponent, ...tooltipStories } as StoriesHash}
      highlightedRef={{ current: { itemId: selectedId, refId } }}
      setHighlightedItemId={log}
      selectedStoryId={selectedId}
      onSelectStoryId={setSelectedId}
    />
  );
};
