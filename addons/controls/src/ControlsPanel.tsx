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
    if (Object.values(rows).some(({ control }) => control?.options)) {
      once.warn(dedent`
        'control.options' is deprecated and will be removed in Storybook 7.0. Define 'options' directly on the argType instead, and use 'control.labels' for custom labels.

        More info: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-controloptions
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
