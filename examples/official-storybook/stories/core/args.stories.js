import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useArgs } from '@storybook/client-api';

// eslint-disable-next-line react/prop-types
const ArgUpdater = ({ args, updateArgs, resetArgs }) => {
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
        <button type="button" onClick={() => resetArgs()}>
          Reset all
        </button>
      </form>
    </div>
  );
};

export default {
  title: 'Core/Args',
  decorators: [
    (story) => {
      const [args, updateArgs, resetArgs] = useArgs();

      return (
        <>
          {story()}
          <ArgUpdater args={args} updateArgs={updateArgs} resetArgs={resetArgs} />
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

PassedToStory.argTypes = { name: { defaultValue: 'initial', control: 'text' } };

PassedToStory.propTypes = {
  args: PropTypes.shape({}).isRequired,
};
