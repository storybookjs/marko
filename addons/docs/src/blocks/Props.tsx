import React, { ComponentProps } from 'react';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import { ArgsTable } from './ArgsTable';
import { CURRENT_SELECTION } from './types';

export const Props = deprecate(
  (props: ComponentProps<typeof ArgsTable>) => <ArgsTable {...props} />,
  dedent`
    Props doc block has been renamed to ArgsTable.

    https://github.com/storybookjs/storybook/issues/11696
  `
);

// @ts-ignore
Props.defaultProps = {
  of: CURRENT_SELECTION,
};
