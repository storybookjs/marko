import React, { FC } from 'react';
import { ArgsTable } from '@storybook/components';
import { useArgs, useArgTypes } from '@storybook/api';

export const ControlsPanel: FC = () => {
  const [args, updateArgs] = useArgs();
  const rows = useArgTypes();
  return <ArgsTable compact {...{ rows, args, updateArgs }} />;
};
