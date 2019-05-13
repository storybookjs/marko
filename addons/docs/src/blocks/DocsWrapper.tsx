/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Global, createGlobal, ThemeProvider, ensure as ensureTheme } from '@storybook/theming';
import { DocumentFormatting } from '@storybook/components';
import { DocsContextProps, DocsContext } from './DocsContext';

interface DocsWrapperProps {
  context: DocsContextProps;
  content: React.ElementType<any>;
}

const defaultComponents = {
  // p: ({ children }) => <b>{children}</b>,
  wrapper: DocumentFormatting,
};

const globalWithOverflow = (args: any) => {
  const global = createGlobal(args);
  const { body, ...rest } = global;
  const { overflow, ...bodyRest } = body;
  return {
    body: bodyRest,
    ...rest,
  };
};

export const DocsWrapper: React.FunctionComponent<DocsWrapperProps> = ({
  context,
  content: MDXContent,
}) => {
  const options = (context && context.parameters && context.parameters.options) || {};

  const theme = ensureTheme(options.theme);
  const { getPropDefs = null, components: userComponents = null } = options.docs || {};
  const components = { ...defaultComponents, ...userComponents };
  return (
    <DocsContext.Provider value={{ ...context, getPropDefs }}>
      <ThemeProvider theme={theme}>
        <Global styles={globalWithOverflow} />
        <MDXProvider components={components}>
          <DocumentFormatting>
            <MDXContent components={components} />
          </DocumentFormatting>
        </MDXProvider>
      </ThemeProvider>
    </DocsContext.Provider>
  );
};
