import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useGlobalArgs } from '@storybook/client-api';

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
  title: 'Core/Global Args',
  decorators: [
    (story) => {
      const [globalArgs, updateGlobalArgs] = useGlobalArgs();

      return (
        <>
          {story()}
          <ArgUpdater args={globalArgs} updateArgs={updateGlobalArgs} />
        </>
      );
    },
  ],
};

export const PassedToStory = ({ globalArgs }) => {
  return (
    <div>
      <h3>Global args:</h3>
      <pre>{JSON.stringify(globalArgs)}</pre>
    </div>
  );
};

PassedToStory.propTypes = {
  globalArgs: PropTypes.shape({}).isRequired,
};

export const SecondStory = ({ globalArgs }) => {
  return (
    <div>
      <h3>Global args (2):</h3>
      <pre>{JSON.stringify(globalArgs)}</pre>
    </div>
  );
};

SecondStory.propTypes = {
  globalArgs: PropTypes.shape({}).isRequired,
};
