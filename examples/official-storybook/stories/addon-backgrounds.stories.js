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

const Template = (args) => <BaseButton {...args} />;

export const Story1 = Template.bind({});
Story1.args = {
  label: 'You should be able to switch backgrounds for this story',
};

export const Story2 = Template.bind({});
Story2.args = {
  label: 'This one too!',
};

export const Overridden = Template.bind({});
Overridden.args = {
  label: 'This one should have different backgrounds',
};
Overridden.parameters = {
  backgrounds: {
    default: 'blue',
    values: [
      { name: 'pink', value: 'hotpink' },
      { name: 'blue', value: 'deepskyblue' },
    ],
  },
};

export const DisabledBackgrounds = Template.bind({});
DisabledBackgrounds.args = {
  label: 'This one should not use backgrounds',
};
DisabledBackgrounds.parameters = {
  backgrounds: { disable: true },
};

export const DisabledGrid = Template.bind({});
DisabledGrid.args = {
  label: 'This one should not use grid',
};
DisabledGrid.parameters = {
  backgrounds: {
    grid: { disable: true },
  },
};
export const GridCellProperties = Template.bind({});
GridCellProperties.args = {
  label: 'This one should have different grid properties',
};
GridCellProperties.parameters = {
  backgrounds: {
    grid: {
      cellSize: 10,
      cellAmount: 4,
      opacity: 0.2,
    },
  },
};

export const AlignedGridWhenFullScreen = Template.bind({});
AlignedGridWhenFullScreen.args = {
  label: 'Grid should have an offset of 0 when in fullscreen',
};
AlignedGridWhenFullScreen.parameters = {
  layout: 'fullscreen',
};
