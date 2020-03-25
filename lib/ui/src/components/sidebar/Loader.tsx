import React, { FunctionComponent, Fragment } from 'react';
import { styled } from '@storybook/theming';

const Loadingitem = styled.div<{
  depth?: number;
}>(
  {
    cursor: 'progress',
    fontSize: 13,
    height: '16px',
    marginTop: 4,
    marginBottom: 4,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ({ depth = 0 }) => ({
    marginLeft: depth * 15,
    maxWidth: 85 - depth * 5,
  }),
  ({ theme }) => theme.animation.inlineGlow,
  ({ theme }) => ({
    background: theme.appBorderColor,
  })
);

export const Contained = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: 20,
  paddingRight: 20,
});

export const Loader: FunctionComponent<{
  size: 'single' | 'multiple';
}> = ({ size }) => {
  return size === 'multiple' ? (
    <Fragment>
      <Loadingitem />
      <Loadingitem />
      <Loadingitem depth={1} />
      <Loadingitem depth={1} />
      <Loadingitem depth={2} />
      <Loadingitem depth={3} />
      <Loadingitem depth={3} />
      <Loadingitem depth={3} />
      <Loadingitem depth={1} />
      <Loadingitem depth={1} />
      <Loadingitem depth={1} />
      <Loadingitem depth={2} />
      <Loadingitem depth={2} />
      <Loadingitem depth={2} />
      <Loadingitem depth={3} />
      <Loadingitem />
      <Loadingitem />
    </Fragment>
  ) : (
    <Loadingitem />
  );
};
