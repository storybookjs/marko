import React, { FunctionComponent, ComponentProps } from 'react';
import { styled } from '@storybook/theming';
import { rotate360 } from '../shared/animation';

const LoaderWrapper = styled.div<{ size?: number }>(({ size = 32 }) => ({
  borderRadius: '50%',
  cursor: 'progress',
  display: 'inline-block',
  overflow: 'hidden',
  position: 'absolute',
  transition: 'all 200ms ease-out',
  verticalAlign: 'top',
  top: '50%',
  left: '50%',
  marginTop: -(size / 2),
  marginLeft: -(size / 2),
  height: size,
  width: size,
  zIndex: 4,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'rgba(97, 97, 97, 0.29)',
  borderTopColor: 'rgb(100,100,100)',
  animation: `${rotate360} 0.7s linear infinite`,
  mixBlendMode: 'difference',
}));

export const Loader: FunctionComponent<ComponentProps<typeof LoaderWrapper>> = (props) => (
  <LoaderWrapper aria-label="Content is loading ..." aria-live="polite" role="status" {...props} />
);
