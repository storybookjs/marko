import React, { FC } from 'react';
import { ArgsTable, NoControlsWarning } from '@storybook/components';
import { useArgs, useArgTypes, useParameter } from '@storybook/api';

import { PARAM_KEY } from '../constants';

interface ControlsParameters {
  expanded?: boolean;
  hideNoControlsWarning?: boolean;
}

export const ControlsPanel: FC = () => {
  const [args, updateArgs] = useArgs();
  const rows = useArgTypes();
  const { expanded, hideNoControlsWarning = false } = useParameter<ControlsParameters>(
    PARAM_KEY,
    {}
  );
  const hasControls = Object.values(rows).filter((argType) => !!argType?.control).length > 0;
  return (
    <>
      {hasControls || hideNoControlsWarning ? null : <NoControlsWarning />}
      <ArgsTable
        {...{ compact: !expanded && hasControls, rows, args, updateArgs, inAddonPanel: true }}
      />
    </>
  );
};
