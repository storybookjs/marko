import React, { FunctionComponent, Suspense } from 'react';
import { styled } from '@storybook/theming';

const GlobalScrollAreaStyles = React.lazy(() => import('./GlobalScrollAreaStyles'));
const OverlayScrollbars = React.lazy(() => import('./OverlayScrollbars'));

const Scroller: FunctionComponent<ScrollAreaProps> = ({ horizontal, vertical, ...props }) => (
  <Suspense fallback={<div {...props} />}>
    <GlobalScrollAreaStyles />
    <OverlayScrollbars options={{ scrollbars: { autoHide: 'leave' } }} {...props} />
  </Suspense>
);

export interface ScrollAreaProps {
  horizontal?: boolean;
  vertical?: boolean;
  className?: string;
}

export const ScrollArea: FunctionComponent<ScrollAreaProps> = styled(Scroller)<ScrollAreaProps>(
  ({ vertical }) => (!vertical ? { overflowY: 'hidden' } : { overflowY: 'auto', height: '100%' }),
  ({ horizontal }) => (!horizontal ? { overflowX: 'hidden' } : { overflowX: 'auto', width: '100%' })
);

ScrollArea.defaultProps = {
  horizontal: false,
  vertical: false,
};
