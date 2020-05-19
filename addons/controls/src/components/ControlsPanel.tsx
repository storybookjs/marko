import React, { FC } from 'react';
import { ArgsTable } from '@storybook/components';
import { useArgs, useArgTypes, useParameter } from '@storybook/api';

interface ControlsParameters {
  compact?: boolean;
}

export const ControlsPanel: FC = () => {
  const [args, updateArgs] = useArgs();
  const rows = useArgTypes();
  const { compact } = useParameter<ControlsParameters>('controls', { compact: true });
  return <ArgsTable {...{ compact, rows, args, updateArgs }} />;
};
