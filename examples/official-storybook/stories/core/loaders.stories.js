import React from 'react';

export default {
  title: 'Core/Loaders',
  loaders: [async () => new Promise((r) => setTimeout(() => r({ loadedValue: 7 }), 3000))],
};

export const Story = (args, { loadedValue }) => <div>Loaded Value is {loadedValue}</div>;
