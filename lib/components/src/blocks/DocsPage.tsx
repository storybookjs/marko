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

const Subtitle = styled.h2();

export const Wrapper = styled(DocumentFormatting)({
  width: 700,
  margin: '4rem auto',
});

export interface DocsPageProps {
  caption?: any;
  title: string;
  subtitle?: string;
  previewProps: PreviewProps;
  propsTableProps: PropsTableProps;
  sourceProps: SourceProps;
}

const DocsPage: React.FunctionComponent<DocsPageProps> = ({
  caption,
  title,
  subtitle,
  previewProps,
  propsTableProps,
  sourceProps,
}) => (
  <Wrapper>
    <Title>{title}</Title>
    <Subtitle>{subtitle}</Subtitle>
    {caption}
    <Preview {...previewProps} />
    <Source {...sourceProps} />
    <PropsTable {...propsTableProps} />
  </Wrapper>
);

export { DocsPage };
