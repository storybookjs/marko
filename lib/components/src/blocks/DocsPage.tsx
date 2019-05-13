import React from 'react';
import { styled } from '@storybook/theming';

import { Story, StoryProps } from './Story';
import { PropsTable, PropsTableProps } from './PropsTable/PropsTable';
import { Source, SourceProps } from './Source';
import { Description, DescriptionProps } from './Description';
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
  title: string;
  subtitle?: string;
  descriptionProps: DescriptionProps;
  storyProps: StoryProps;
  propsTableProps: PropsTableProps;
  sourceProps: SourceProps;
}

const DocsPage: React.FunctionComponent<DocsPageProps> = ({
  title,
  subtitle,
  descriptionProps,
  storyProps,
  propsTableProps,
  sourceProps,
}) => (
  <Wrapper>
    <Title>{title}</Title>
    <Subtitle>{subtitle}</Subtitle>
    <Description {...descriptionProps} />
    <Story {...storyProps} />
    <Source {...sourceProps} />
    <PropsTable {...propsTableProps} />
  </Wrapper>
);

export { DocsPage };
