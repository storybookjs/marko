import React from 'react';

export default {
  title: 'UI/Addon Panel',
};

export const AllAddons = () => <div>By default all addon panels are rendered</div>;
export const FilteredAddons = () => <div>By default all addon panels are rendered</div>;

FilteredAddons.parameters = {
  a11y: { disable: true },
  actions: { disable: true },
};
