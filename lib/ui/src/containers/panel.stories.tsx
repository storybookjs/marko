import React from 'react';

export default {
  title: 'UI/Addon Panel',
};

export const AllAddons = () => <div>By default all addon panels are rendered</div>;
export const FilteredAddons = () => <div>By default all addon panels are rendered</div>;

FilteredAddons.story = {
  parameters: {
    a11y: { disabled: true },
    actions: { disabled: true },
  },
};
