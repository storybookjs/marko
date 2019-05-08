import React from 'react';

import { Preview, PreviewProps } from './Preview';
import { Props, PropsProps } from './Props';
import { Source, SourceProps } from './Source';

export interface DocsPageProps {
  title: string;
  previewProps: PreviewProps;
  propsProps: PropsProps;
  sourceProps: SourceProps;
}

const DocsPage: React.FunctionComponent<DocsPageProps> = ({
  title,
  previewProps,
  propsProps,
  sourceProps,
}) => (
  <div>
    <h1>{title}</h1>
    <Preview {...previewProps} />
    <Source {...sourceProps} />
    <Props {...propsProps} />
  </div>
);

export { DocsPage };
