import React from 'react';

import { Preview, PreviewProps } from './Preview';
import { Props, PropsProps } from './Props';
import { Source, SourceProps } from './Source';

export interface DocsPageProps {
  caption: any;
  title: string;
  previewProps: PreviewProps;
  propsProps: PropsProps;
  sourceProps: SourceProps;
}

const DocsPage: React.FunctionComponent<DocsPageProps> = ({
  caption,
  title,
  previewProps,
  propsProps,
  sourceProps,
}) => (
  <div>
    <h1>{title}</h1>
    <Preview {...previewProps} />
    <Source {...sourceProps} />
    {caption}
    <Props {...propsProps} />
  </div>
);

export { DocsPage };
