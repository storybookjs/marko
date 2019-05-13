import React from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';

import { Preview, PreviewProps } from './Preview';
import { PropsTable, PropsTableProps } from './PropsTable/PropsTable';
import { Source, SourceProps } from './Source';
import { Description, DescriptionProps } from './Description';
import { DocumentFormatting } from '../typography/DocumentFormatting';

export const breakpoint = 600;
export const pageMargin = '5.55555';

const Title = styled.h1(({ theme }) => ({
  // overrides h1 in DocumentFormatting
  '&&': {
    fontSize: theme.typography.size.m3,
    lineHeight: '32px',

    [`@media (min-width: ${breakpoint * 1}px)`]: {
      fontSize: theme.typography.size.l1,
      lineHeight: '36px',
    },
  },
}));

const Subtitle = styled.h2(({ theme }) => ({
  // overrides h2 in DocumentFormatting
  '&&': {
    fontWeight: theme.typography.weight.regular,
    fontSize: theme.typography.size.s3,
    lineHeight: '20px',
    borderBottom: 'none',
    marginBottom: '15px',

    [`@media (min-width: ${breakpoint * 1}px)`]: {
      fontSize: theme.typography.size.m1,
      lineHeight: '28px',
      marginBottom: '25px',
    },
  },

  color:
    theme.base === 'light'
      ? transparentize(0.25, theme.color.defaultText)
      : transparentize(0.25, theme.color.defaultText),
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
  padding: '4rem 20px',

  [`@media (min-width: ${breakpoint * 1}px)`]: {},
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
