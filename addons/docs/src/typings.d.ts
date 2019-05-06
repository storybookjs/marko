// todo the following packages need definition files or a TS migration
// declare module '@storybook/components';
declare module '@mdx-js/react';
declare module 'global';
declare module 'react-inspector';
declare module 'telejson';

interface PropDef {
  name: string;
  type: any;
  required: boolean;
  description?: string;
  defaultValue?: any;
}
