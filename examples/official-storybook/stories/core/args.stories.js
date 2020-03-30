import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useArgs } from '@storybook/client-api';

// eslint-disable-next-line react/prop-types
const ArgUpdater = ({ args, updateArgs }) => {
  const [argsInput, updateArgsInput] = useState(JSON.stringify(args));

  return (
    <div>
      <h3>Hooks args:</h3>
      <pre>{JSON.stringify(args)}</pre>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateArgs(JSON.parse(argsInput));
        }}
      >
        <textarea value={argsInput} onChange={(e) => updateArgsInput(e.target.value)} />
        <br />
        <button type="submit">Change</button>
      </form>
    </div>
  );
};

export default {
  title: 'Core/Args',
  parameters: {
    passArgsFirst: true,
  },
  decorators: [
    (story) => {
      const [args, updateArgs] = useArgs();

      return (
        <>
          {story()}
          <ArgUpdater args={args} updateArgs={updateArgs} />
        </>
      );
    },
  ],
};

export const PassedToStory = (inputArgs) => {
  return (
    <div>
      <h3>Input args:</h3>
      <pre>{JSON.stringify(inputArgs)}</pre>
    </div>
  );
};

PassedToStory.story = {
  argTypes: { name: { defaultValue: 'initial' } },
};

PassedToStory.propTypes = {
  args: PropTypes.shape({}).isRequired,
};
