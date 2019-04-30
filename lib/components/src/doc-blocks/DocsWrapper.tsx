/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { DocsContextProps, DocsContext } from './DocsContext';
import { Wrapper } from './Wrapper';

interface DocsWrapperProps {
  context: DocsContextProps;
  content: React.ElementType<any>;
}

export const DocsWrapper: React.FunctionComponent<DocsWrapperProps> = ({
  context,
  content: MDXContent,
}) => {
  const options =
    (context &&
      context.parameters &&
      context.parameters.options &&
      context.parameters.options.docs) ||
    {};
  return (
    <DocsContext.Provider value={context}>
      <Wrapper>
        <MDXContent components={options.mdxComponents} />
      </Wrapper>
    </DocsContext.Provider>
  );
};
