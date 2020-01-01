declare module 'global';
declare module 'simplebar-react';
declare module 'markdown-to-jsx';
declare module '*.md';

declare module "react-syntax-highlighter/dist/cjs/languages/*" {
    const language: any;
    export default language;
}

declare module "react-syntax-highlighter/dist/cjs/prism-light" {
    import * as React from "react";
    import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
    export default class SyntaxHighlighter extends React.Component<
        SyntaxHighlighterProps
    > {
        static registerLanguage(name: string, func: any): void;
    }
}