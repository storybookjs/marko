import React from 'react';

import BaseButton from '../components/BaseButton';

export default {
  title: 'Addons/Backgrounds',

  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'light', value: '#eeeeee' },
        { name: 'gray', value: '#cccccc' },
        { name: 'dark', value: '#222222' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
};

export const Story1 = () => (
  <BaseButton label="You should be able to switch backgrounds for this story" />
);

Story1.storyName = 'story 1';

export const Story2 = () => <BaseButton label="This one too!" />;

Story2.storyName = 'story 2';

export const Overridden = () => <BaseButton label="This one should have different backgrounds" />;

Overridden.parameters = {
  backgrounds: {
    default: 'blue',
    values: [
      { name: 'pink', value: 'hotpink' },
      { name: 'blue', value: 'deepskyblue' },
    ],
  },
};

export const SkippedViaDisableTrue = () => (
  <BaseButton label="This one should not use backgrounds" />
);

SkippedViaDisableTrue.storyName = 'skipped via disable: true';

SkippedViaDisableTrue.parameters = {
  backgrounds: { disable: true },
};

export const GridCellSize = () => (
  <BaseButton label="This one should have a different grid cell size" />
);

GridCellSize.parameters = {
  grid: { cellSize: 10 },
};
