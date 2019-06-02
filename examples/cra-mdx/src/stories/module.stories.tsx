import React from 'react';
import TypescriptButton from './TypescriptButton';

export default {
  title: 'Typescript|Module',
  decorators: [],
  parameters: { component: TypescriptButton },
};

export const small = (): any => <TypescriptButton variant="small" />;
export const large = (): any => <TypescriptButton variant="large" />;
