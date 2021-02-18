import React, { Suspense } from 'react';

const LazyWithTooltip = React.lazy(() =>
  import('./WithTooltip').then((mod) => ({ default: mod.WithTooltip }))
);

export const WithTooltip = (props: React.ComponentProps<typeof LazyWithTooltip>) => (
  <Suspense fallback={<div />}>
    <LazyWithTooltip {...props} />
  </Suspense>
);

const LazyWithTooltipPure = React.lazy(() =>
  import('./WithTooltip').then((mod) => ({ default: mod.WithTooltipPure }))
);

export const WithTooltipPure = (props: React.ComponentProps<typeof LazyWithTooltipPure>) => (
  <Suspense fallback={<div />}>
    <LazyWithTooltipPure {...props} />
  </Suspense>
);
