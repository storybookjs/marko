import React from 'react';
import { styled } from '@storybook/theming';

import { Preview, PreviewProps } from './Preview';
import { PropsTable, PropsTableProps } from './PropsTable/PropsTable';
import { Source, SourceProps } from './Source';
import { Description, DescriptionProps } from './Description';
import { DocumentFormatting } from '../typography/DocumentFormatting';

const Title = styled.h1(({ theme }) => ({
  // fontSize: theme.typography.size.l1,
  // fontWeight: theme.typography.weight.black,
}));

const Subtitle = styled.h2(({ theme }) => ({
  // overrides h2 in DocumentFormatting
  fontSize: theme.typography.size.m3,
  fontWeight: theme.typography.weight.black,
}));

export const Content = styled(DocumentFormatting)({
  maxWidth: 700,
  width: '100%',
});

const Wrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  paddingTop: '4rem',
  paddingBottom: '4rem',
}));

export interface DocsPageProps {
  title: string;
  subtitle?: string;
  descriptionProps: DescriptionProps;
  previewProps: PreviewProps;
  propsTableProps: PropsTableProps;
  sourceProps: SourceProps;
}

const DocsPage: React.FunctionComponent<DocsPageProps> = ({
  title,
  subtitle,
  descriptionProps,
  previewProps,
  propsTableProps,
  sourceProps,
}) => (
  <Wrapper>
    <Content>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {descriptionProps && <Description {...descriptionProps} />}
      {previewProps && <Preview {...previewProps} />}
      {sourceProps && <Source {...sourceProps} />}
      {propsTableProps && <PropsTable {...propsTableProps} />}
    </Content>
  </Wrapper>
);

export { DocsPage };
