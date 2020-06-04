import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { ArgsTable, Link } from '@storybook/components';
import { useArgs, useArgTypes, useParameter } from '@storybook/api';
import { PARAM_KEY } from '../constants';

interface ControlsParameters {
  expanded?: boolean;
}

const NoControlsWrapper = styled.div(({ theme }) => ({
  background: theme.background.warning,
  padding: 20,
}));

const NoControlsWarning = () => (
  <NoControlsWrapper>
    No controls found for this component.&nbsp;
    <Link
      href="https://github.com/storybookjs/storybook/blob/next/addons/controls/README.md#writing-stories"
      target="_blank"
      cancel={false}
    >
      Learn how to add controls »
    </Link>
  </NoControlsWrapper>
);

export const ControlsPanel: FC = () => {
  const [args, updateArgs] = useArgs();
  const rows = useArgTypes();
  const { expanded } = useParameter<ControlsParameters>(PARAM_KEY, {});
  const hasControls = Object.values(rows).filter((argType) => argType?.control?.type).length > 0;
  return (
    <>
      {hasControls ? null : <NoControlsWarning />}
      <ArgsTable {...{ compact: !expanded && hasControls, rows, args, updateArgs }} />
    </>
  );
};
