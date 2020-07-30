import React from 'react';

export const decorators = [
  (StoryFn, { parameters, globals }) => (
    <div>
      {parameters.prefix} <StoryFn /> {globals.suffix}
    </div>
  ),
];

export const parameters = { prefix: 'prefix' };
export const globals = { suffix: 'suffix' };
