import React, { FC } from 'react';
import { ArgsTable } from '@storybook/components';
import { useArgs, useArgTypes, useParameter } from '@storybook/api';

interface ControlsParameters {
  expanded?: boolean;
}

export const ControlsPanel: FC = () => {
  const [args, updateArgs] = useArgs();
  const rows = useArgTypes();
  const { expanded } = useParameter<ControlsParameters>('controls', {});
  return <ArgsTable {...{ compact: !expanded, rows, args, updateArgs }} />;
};
