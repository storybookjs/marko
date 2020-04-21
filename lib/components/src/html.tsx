import { createElement, ElementType } from 'react';

import { components as rawComponents } from './typography/DocumentFormatting';

export * from './typography/DocumentFormatting';

export { rawComponents as components };

const resetComponents: Record<string, ElementType> = {};

Object.keys(rawComponents).forEach((key) => {
  resetComponents[key] = (props: any) => createElement(key, props);
});

export { resetComponents };
