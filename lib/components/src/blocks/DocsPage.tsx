import React from 'react';
import { styled } from '@storybook/theming';

import { Preview, PreviewProps } from './Preview';
import { PropsTable, PropsTableProps } from './PropsTable/PropsTable';
import { Source, SourceProps } from './Source';
import { DocumentFormatting } from '../typography/DocumentFormatting';

const Title = styled.h1(({ theme }) => ({
  // fontSize: theme.typography.size.l1,
  // fontWeight: theme.typography.weight.black,
}));

export const Wrapper = styled(DocumentFormatting)({
  width: 700,
  margin: '4rem auto',
});

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
  <Wrapper>
    <Title>{title}</Title>
    <Preview {...previewProps} />
    <Source {...sourceProps} />
    {caption}
    <PropsTable {...propsTableProps} />
  </Wrapper>
);

export { DocsPage };
