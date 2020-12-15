import React, { Suspense } from 'react';

const LazySyntaxHighlighter = React.lazy(() => import('./syntaxhighlighter'));

export const SyntaxHighlighter = (props: React.ComponentProps<typeof LazySyntaxHighlighter>) => (
  <Suspense fallback={<div />}>
    <LazySyntaxHighlighter {...props} />
  </Suspense>
);
