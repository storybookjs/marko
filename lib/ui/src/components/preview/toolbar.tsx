import React, { FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

import { FlexBar } from '@storybook/components';

const Bar: FunctionComponent<{ shown: boolean } & Record<string, any>> = ({ shown, ...props }) => (
  <FlexBar {...props} />
);

export const Toolbar = styled(Bar)(
  {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    transition: 'transform .2s linear',
  },
  ({ shown }) => ({
    tranform: shown ? 'translateY(0px)' : 'translateY(-40px)',
  })
);
