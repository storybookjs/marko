import React from 'react';
import TypescriptButton from './TypescriptButton';

export const componentMeta = {
  title: 'Module|TypescriptButton',
  decorators: [],
  parameters: { component: TypescriptButton },
};

export const small = () => <TypescriptButton variant="small" />;
export const large = () => <TypescriptButton variant="large" />;
export const docgenInfo = () => <div>{JSON.stringify(TypescriptButton.__docgenInfo)}</div>;
