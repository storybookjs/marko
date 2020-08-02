import React from 'react';

// We would need to add this in config.js idiomatically however that would make this file a bit confusing
import { addDecorator } from '@storybook/react';

addDecorator((s, { kind }) =>
  kind === 'Core/Decorators' ? (
    <>
      <p>Global Decorator</p>
      {s()}
    </>
  ) : (
    s()
  )
);

export default {
  title: 'Core/Decorators',
  decorators: [
    (s) => (
      <>
        <p>Kind Decorator</p>
        {s()}
      </>
    ),
  ],
};

export const All = () => <p>Story</p>;
All.decorators = [
  (s) => (
    <>
      <p>Local Decorator</p>
      {s()}
    </>
  ),
];
