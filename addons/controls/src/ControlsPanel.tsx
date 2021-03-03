import React, { FC, useEffect } from 'react';
import dedent from 'ts-dedent';
import { useArgs, useArgTypes, useParameter } from '@storybook/api';
import { once } from '@storybook/client-logger';
import { ArgsTable, NoControlsWarning } from '@storybook/components';

import { PARAM_KEY } from './constants';

interface ControlsParameters {
  expanded?: boolean;
  hideNoControlsWarning?: boolean;
}

export const ControlsPanel: FC = () => {
  const [args, updateArgs, resetArgs] = useArgs();
  const rows = useArgTypes();
  const isArgsStory = useParameter<boolean>('__isArgsStory', false);
  const { expanded, hideNoControlsWarning = false } = useParameter<ControlsParameters>(
    PARAM_KEY,
    {}
  );

  useEffect(() => {
    if (
      Object.values(rows).some(({ control: { options = {} } = {} }) =>
        Object.values(options).some((v) => !['boolean', 'number', 'string'].includes(typeof v))
      )
    ) {
      once.warn(dedent`
        Only primitives are supported as values in control options. Use a 'mapping' for complex values.

        More info: https://storybook.js.org/docs/react/writing-stories/args#mapping-to-complex-arg-values
      `);
    }
  }, [rows]);

  const hasControls = Object.values(rows).some((arg) => arg?.control);
  const showWarning = !(hasControls && isArgsStory) && !hideNoControlsWarning;

  return (
    <>
      {showWarning && <NoControlsWarning />}
      <ArgsTable
        {...{
          compact: !expanded && hasControls,
          rows,
          args,
          updateArgs,
          resetArgs,
          inAddonPanel: true,
        }}
      />
    </>
  );
};
