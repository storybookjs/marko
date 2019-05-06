import React from 'react';

import { Props } from './Props';
import { Preview } from './Preview';
import { DocsContext, DocsContextProps } from './DocsContext';
import { DocsWrapper } from './DocsWrapper';

interface InfoProps {
  context: DocsContextProps;
}

export const InfoContent: React.FunctionComponent = () => (
  <DocsContext.Consumer>
    {({ selectedStory }) => (
      <div>
        <h1>{selectedStory}</h1>
        <Preview />
        <Props />
      </div>
    )}
  </DocsContext.Consumer>
);

export const Info: React.FunctionComponent<InfoProps> = ({ context }) => (
  // eslint-disable-next-line react/destructuring-assignment
  <DocsWrapper context={{ ...context, mdxKind: context.selectedKind }} content={InfoContent} />
);
