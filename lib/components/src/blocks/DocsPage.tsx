import React from 'react';

import { Preview, PreviewProps } from './Preview';
import { PropsTable, PropsTableProps } from './PropsTable/PropsTable';
import { Source, SourceProps } from './Source';

export interface DocsPageProps {
  caption?: any;
  title: string;
  previewProps: PreviewProps;
  propsTableProps: PropsTableProps;
  sourceProps: SourceProps;
}

const DocsPage: React.FunctionComponent<DocsPageProps> = ({
  caption,
  title,
  previewProps,
  propsTableProps,
  sourceProps,
}) => (
  <div>
    <h1>{title}</h1>
    <Preview {...previewProps} />
    <Source {...sourceProps} />
    {caption}
    <PropsTable {...propsTableProps} />
  </div>
);

export { DocsPage };
