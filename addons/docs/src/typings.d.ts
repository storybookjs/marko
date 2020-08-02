declare module '@mdx-js/react';
declare module 'global';
declare module '@egoist/vue-to-react';
declare module 'remark-slug';
declare module 'remark-external-links';
declare module 'babel-plugin-react-docgen';
declare module 'require-from-string';
declare module 'styled-components';
declare module 'acorn-jsx';

declare module 'react-element-to-jsx-string' {
  export interface Options {
    showFunctions?: boolean;
    displayName?(): string;
    tabStop?: number;
  }

  export default function render(element: React.ReactNode, options: Options): string;
}
